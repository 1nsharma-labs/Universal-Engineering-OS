# UNIFORGE Plugin Marketplace

Curated ecosystem of official open-source and commercial third-party plugins powered by `@uniforge/plugin-sdk`.

## Revenue Model
- **Free & Official Plugins**: 100% open-source Apache-2.0 (`Docker Manager`, `pgvector Explorer`, `p5.js Studio`, `Spring Boot Controller`, `Ollama AI Studio`).
- **Paid & Enterprise Plugins**: Transparent **70% Developer / 30% Platform** revenue share settled monthly via Stripe Connect.
- **Cryptographic Licensing**: All commercial installations are verified via HMAC-SHA256 signed license keys (`marketplace/billing.py`).

## API Endpoints
- `GET /api/v1/marketplace/catalog` — Browse & filter all verified plugins
- `POST /api/v1/marketplace/checkout` — Generate Checkout session, 70/30 revenue split, and license key
- `POST /api/v1/marketplace/verify-license` — Validate an issued `UFG-*` license key

