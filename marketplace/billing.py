"""
UNIFORGE Plugin Marketplace — Billing, 70/30 Revenue Split & Cryptographic License Engine
"""

import hashlib
import hmac
import json
import os
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

CATALOG_PATH = Path(__file__).resolve().parent / "catalog.json"
DEFAULT_SIGNING_SECRET = os.getenv("UNIFORGE_LICENSE_SECRET", "uniforge-dev-signing-secret-change-in-prod")


def load_catalog() -> Dict[str, Any]:
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def calculate_revenue_split(gross_usd: float) -> Dict[str, Any]:
    """Calculates canonical 70% developer / 30% platform revenue share in cents and USD."""
    gross_cents = int(round(gross_usd * 100))
    developer_cents = int(round(gross_cents * 0.70))
    platform_cents = gross_cents - developer_cents
    return {
        "gross_usd": round(gross_cents / 100.0, 2),
        "developer_share_usd": round(developer_cents / 100.0, 2),
        "platform_share_usd": round(platform_cents / 100.0, 2),
        "gross_cents": gross_cents,
        "developer_cents": developer_cents,
        "platform_cents": platform_cents,
        "split_ratio": "70/30",
    }


def issue_license_key(tenant_id: str, plugin_id: str, tier: str = "paid_monthly", secret: Optional[str] = None) -> Dict[str, Any]:
    """Issues a deterministic HMAC-SHA256 signed UNIFORGE plugin license key."""
    key_secret = (secret or DEFAULT_SIGNING_SECRET).encode("utf-8")
    issued_at = int(time.time())
    payload = f"{tenant_id}|{plugin_id}|{tier}|{issued_at}"
    sig = hmac.new(key_secret, payload.encode("utf-8"), hashlib.sha256).hexdigest()[:24].upper()
    license_key = f"UFG-{tier[:3].upper()}-{issued_at}-{sig}"
    return {
        "license_key": license_key,
        "tenant_id": tenant_id,
        "plugin_id": plugin_id,
        "tier": tier,
        "issued_at": issued_at,
        "verified": True,
    }


def verify_license_key(license_key: str, tenant_id: str, plugin_id: str, tier: str = "paid_monthly", secret: Optional[str] = None) -> bool:
    """Verifies an issued HMAC-SHA256 UNIFORGE plugin license key in constant time."""
    parts = license_key.split("-")
    if len(parts) != 4 or parts[0] != "UFG":
        return False
    _, tier_prefix, issued_at_str, sig = parts
    if tier_prefix != tier[:3].upper():
        return False
    key_secret = (secret or DEFAULT_SIGNING_SECRET).encode("utf-8")
    payload = f"{tenant_id}|{plugin_id}|{tier}|{issued_at_str}"
    expected = hmac.new(key_secret, payload.encode("utf-8"), hashlib.sha256).hexdigest()[:24].upper()
    return hmac.compare_digest(sig, expected)


def verify_stripe_webhook_signature(raw_payload: bytes, signature_header: str, webhook_secret: str) -> bool:
    """Verifies a Stripe-compatible `t=<ts>,v1=<hmac>` webhook signature."""
    try:
        items = dict(item.split("=", 1) for item in signature_header.split(",") if "=" in item)
        timestamp = items.get("t", "")
        v1_sig = items.get("v1", "")
        if not timestamp or not v1_sig:
            return False
        signed_payload = f"{timestamp}.".encode("utf-8") + raw_payload
        expected = hmac.new(webhook_secret.encode("utf-8"), signed_payload, hashlib.sha256).hexdigest()
        return hmac.compare_digest(v1_sig, expected)
    except Exception:
        return False


def create_checkout_preview(tenant_id: str, plugin_id: str) -> Dict[str, Any]:
    """Builds a Stripe Checkout session preview and revenue split for a Marketplace plugin."""
    catalog = load_catalog()
    plugin = next((p for p in catalog["plugins"] if p["id"] == plugin_id), None)
    if not plugin:
        return {"ok": False, "error": f"Plugin '{plugin_id}' not found in Marketplace catalog."}

    price = float(plugin.get("priceUsdMonthly", 0))
    if price <= 0:
        lic = issue_license_key(tenant_id, plugin_id, tier="free")
        return {
            "ok": True,
            "mode": "instant_free_install",
            "plugin": plugin,
            "license": lic,
        }

    split = calculate_revenue_split(price)
    lic = issue_license_key(tenant_id, plugin_id, tier=plugin["tier"])
    return {
        "ok": True,
        "mode": "stripe_checkout_session",
        "checkout_url": f"https://checkout.uniforge.io/session/{tenant_id}/{plugin['id'].replace('/', '_')}",
        "plugin": plugin,
        "revenue_split": split,
        "preview_license": lic,
    }


def search_marketplace(query: str = "", tier: str = "") -> List[Dict[str, Any]]:
    catalog = load_catalog()
    q = query.strip().lower()
    t = tier.strip().lower()
    out = []
    for p in catalog["plugins"]:
        if t and p["tier"].lower() != t:
            continue
        if q:
            haystack = f"{p['id']} {p['name']} {p['category']} {p['description']} {p['author']}".lower()
            if q not in haystack:
                continue
        out.append(p)
    return out

