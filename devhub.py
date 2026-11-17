#!/usr/bin/env python3
"""
UNIFORGE (Universal-Engineering-OS) — Monolithic Cross-Platform Root Controller
Works natively on Windows (PowerShell/CMD), macOS, and Linux.
"""

import argparse
import json
import platform
import shutil
import subprocess
import sys
from pathlib import Path

VERSION = "1.0.0"
ORG = "uniforge-os / Universal-Engineering-OS"
ROOT = Path(__file__).resolve().parent
ORCH_DIR = ROOT / "00-universal-control-plane" / "orchestrator-api"
if str(ORCH_DIR) not in sys.path:
    sys.path.insert(0, str(ORCH_DIR))


def run_cmd(cmd, cwd=None):
    print(f"--> Running: {' '.join(cmd)}")
    try:
        return subprocess.run(cmd, cwd=cwd or ROOT, check=False).returncode
    except FileNotFoundError:
        print(f"[ERROR] Command not found: {cmd[0]}")
        return 1


def cmd_version(_args):
    print(f"UNIFORGE Universal Engineering OS v{VERSION}")
    print(f"Organization : {ORG}")
    print(f"Python       : {sys.version.split()[0]} ({platform.system()} {platform.machine()})")
    print(f"Workspace    : {ROOT}")


def cmd_init(_args):
    env_example = ROOT / "04-connectors-and-apis" / ".env.example"
    env_target = ROOT / "04-connectors-and-apis" / ".env"
    if env_example.exists() and not env_target.exists():
        shutil.copyfile(env_example, env_target)
        print(f"[OK] Created {env_target} from template.")
    elif env_target.exists():
        print(f"[OK] Environment file already exists: {env_target}")

    print("\nChecking installed polyglot toolchains:")
    tools = ["docker", "python", "node", "npm", "java", "mvn", "go", "rustc", "git", "gh"]
    for tool in tools:
        found = shutil.which(tool)
        status = f"FOUND ({found})" if found else "MISSING"
        print(f"  - {tool:10}: {status}")


def cmd_studio(args):
    from main import run_server
    run_server(port=args.port, host=args.host)


def cmd_architect(args):
    from brain import architect_solution
    blueprint = architect_solution(" ".join(args.prompt), args.mode)
    print(json.dumps(blueprint, indent=2))


def cmd_registry(args):
    from brain import search_registry
    items = search_registry(query=args.query, domain=args.domain)
    print(f"Found {len(items)} technologies in Universal Technology Registry:")
    for t in items:
        print(f"  [{t['domain_id']:15}] {t['name']:32} | {t['language']:24} | {t.get('hub_module', '')}")


def cmd_wiki(args):
    from studio_services import get_wiki_profile, list_wiki_profiles
    if args.slug:
        res = get_wiki_profile(args.slug)
        if not res.get("ok"):
            print(f"[ERROR] {res.get('error')}")
            sys.exit(1)
        print(res["markdown"])
    else:
        data = list_wiki_profiles(query=args.query)
        print(f"UNIFORGE Universal Wiki — {data['total']} Technology Profiles:")
        for p in data["profiles"]:
            print(f"  - {p['slug']:28} | {p['title']}")


def cmd_plugin(args):
    from studio_services import list_installed_plugins
    action = args.action
    if action == "list":
        data = list_installed_plugins()
        print(f"Installed Official UNIFORGE Plugins ({data['count']}):")
        for p in data["plugins"]:
            m = p.get("manifest", {})
            print(f"  [{p['status']}] {m.get('id', p['folder']):40} v{m.get('version', '?')} ({m.get('category', '')})")
    elif action == "verify":
        cli_js = ROOT / "packages" / "plugin-sdk" / "dist" / "cli.js"
        if not cli_js.exists():
            print("[ERROR] @uniforge/plugin-sdk not built yet. Run: make plugin-sdk")
            sys.exit(1)
        rc = 0
        for manifest in sorted((ROOT / "plugins").glob("*/uniforge-plugin.json")):
            code = run_cmd(["node", str(cli_js), "validate", str(manifest)])
            if code != 0:
                rc = code
        sys.exit(rc)
    elif action == "build-sdk":
        sdk_dir = ROOT / "packages" / "plugin-sdk"
        npm_cmd = "npm.cmd" if platform.system() == "Windows" else "npm"
        rc = run_cmd([npm_cmd, "run", "build"], cwd=sdk_dir)
        if rc == 0:
            rc = run_cmd([npm_cmd, "test"], cwd=sdk_dir)
        sys.exit(rc)


def cmd_marketplace(args):
    from studio_services import get_marketplace_catalog, run_marketplace_checkout
    if args.checkout:
        res = run_marketplace_checkout(args.tenant, args.checkout)
        print(json.dumps(res, indent=2))
        return
    cat = get_marketplace_catalog(query=args.query, tier=args.tier)
    print(f"UNIFORGE Plugin Marketplace v{cat['marketplaceVersion']} (Split: 70% Dev / 30% Platform):")
    for p in cat["plugins"]:
        price = f"${p['priceUsdMonthly']}/mo" if p["priceUsdMonthly"] > 0 else "FREE"
        print(f"  [{p['tier']:12}] {p['id']:42} | {price:8} | ★ {p['rating']} | {p['author']}")


def cmd_cloud(args):
    from studio_services import create_cloud_tenant, get_cloud_overview
    if args.action == "status":
        print(json.dumps(get_cloud_overview(), indent=2))
    elif args.action == "up":
        sys.exit(run_cmd(["docker", "compose", "-f", "cloud/docker-compose.cloud.yml", "up", "-d"]))
    elif args.action == "down":
        sys.exit(run_cmd(["docker", "compose", "-f", "cloud/docker-compose.cloud.yml", "down"]))
    elif args.action == "create-tenant":
        res = create_cloud_tenant(args.org or "Demo Organization", args.tier, args.region)
        print(json.dumps(res, indent=2))


def cmd_unify(args):
    from project_unifier import unify_project
    print(json.dumps(unify_project(args.target), indent=2))


def cmd_sandbox(args):
    from sandbox_runner import execute_in_sandbox
    print(json.dumps(execute_in_sandbox(args.language, args.code, dry_run=not args.run), indent=2))


def cmd_up(args):
    cmd = [
        "docker", "compose",
        "-f", "04-connectors-and-apis/docker-compose.infra.yml",
        "--env-file", "04-connectors-and-apis/.env.example",
    ]
    if args.milvus:
        cmd.extend(["--profile", "milvus"])
    cmd.extend(["up", "-d"])
    sys.exit(run_cmd(cmd))


def cmd_down(_args):
    stacks = [
        "cloud/docker-compose.cloud.yml",
        "00-universal-control-plane/hybrid-sync/docker-compose.control-plane.yml",
        "04-connectors-and-apis/docker-compose.infra.yml",
        "03-ai-models-and-inference/docker-compose.models.yml",
        "10-automation-and-workflows/docker-compose.auto.yml",
        "12-observability-and-logs/docker-compose.monitor.yml",
    ]
    for stack in stacks:
        if (ROOT / stack).exists():
            run_cmd(["docker", "compose", "-f", stack, "down"])


def cmd_ps(_args):
    sys.exit(run_cmd(["docker", "ps", "--format", "table {{.Names}}\t{{.Status}}\t{{.Ports}}"]))


def cmd_models(_args):
    sys.exit(run_cmd(["docker", "compose", "-f", "03-ai-models-and-inference/docker-compose.models.yml", "up", "-d"]))


def cmd_auto(_args):
    sys.exit(run_cmd(["docker", "compose", "-f", "10-automation-and-workflows/docker-compose.auto.yml", "up", "-d"]))


def cmd_monitor(_args):
    sys.exit(run_cmd(["docker", "compose", "-f", "12-observability-and-logs/docker-compose.monitor.yml", "up", "-d"]))


def cmd_creative(_args):
    print("Serving Creative Coding & Games at http://localhost:8088 ...")
    sys.exit(run_cmd([sys.executable, "-m", "http.server", "8088", "--directory", "02-frameworks-and-templates/creative-coding-and-games"]))


def cmd_agents(_args):
    scripts = [
        "langchain_agent.py",
        "llamaindex_rag.py",
        "crewai_runner.py",
        "autogen_team.py",
        "langgraph_workflow.py",
    ]
    for s in scripts:
        run_cmd([sys.executable, f"02-frameworks-and-templates/ai-agents/{s}"])


def cmd_datasets(_args):
    sys.exit(run_cmd([sys.executable, "06-open-source-datasets/fetch-datasets.py", "--list"]))


def cmd_test(_args):
    sys.exit(run_cmd([sys.executable, "-m", "pytest", "09-testing-and-security/tests/"]))


def cmd_validate(_args):
    print("=== Validating All JSON & YAML Manifests Across All Modules ===")
    errors = 0
    json_count = 0
    yaml_count = 0

    for path in ROOT.rglob("*.json"):
        if "node_modules" in path.parts or "dist" in path.parts:
            continue
        json_count += 1
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"[FAIL] JSON {path.relative_to(ROOT)}: {e}")
            errors += 1

    try:
        import yaml
        for ext in ("*.yml", "*.yaml"):
            for path in ROOT.rglob(ext):
                if "templates" in path.parts or "node_modules" in path.parts:
                    continue
                yaml_count += 1
                try:
                    list(yaml.safe_load_all(path.read_text(encoding="utf-8")))
                except Exception as e:
                    print(f"[FAIL] YAML {path.relative_to(ROOT)}: {e}")
                    errors += 1
    except ImportError:
        print("[WARN] PyYAML not installed; skipping YAML validation.")

    if errors == 0:
        print(f"[OK] Validated {json_count} JSON files and {yaml_count} YAML files with 0 errors!")
    else:
        print(f"[ERROR] Found {errors} invalid manifests.")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description=f"UNIFORGE ({ORG}) — Monolithic Root Controller v{VERSION}")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("version", help="Display UNIFORGE OS version and environment info").set_defaults(func=cmd_version)
    sub.add_parser("init", help="Copy .env template and audit local polyglot toolchains").set_defaults(func=cmd_init)

    p_studio = sub.add_parser("studio", help="Launch UNIFORGE Operational Studio (default port 7000)")
    p_studio.add_argument("--port", type=int, default=7000)
    p_studio.add_argument("--host", default="0.0.0.0")
    p_studio.set_defaults(func=cmd_studio)

    p_arch = sub.add_parser("architect", help="Run Universal Engineering Brain on a project idea")
    p_arch.add_argument("prompt", nargs="+", help="Natural-language project requirements")
    p_arch.add_argument("--mode", default="hybrid-local-cloud")
    p_arch.set_defaults(func=cmd_architect)

    p_reg = sub.add_parser("registry", help="Search the 15-Domain Technology Registry (60+ Techs)")
    p_reg.add_argument("--query", "-q", default="")
    p_reg.add_argument("--domain", "-d", default="")
    p_reg.set_defaults(func=cmd_registry)

    p_wiki = sub.add_parser("wiki", help="Search or read the 60+ Universal Wiki profiles")
    p_wiki.add_argument("--query", "-q", default="")
    p_wiki.add_argument("--slug", "-s", default="")
    p_wiki.set_defaults(func=cmd_wiki)

    p_plug = sub.add_parser("plugin", help="Manage @uniforge/plugin-sdk and Official Plugins")
    p_plug.add_argument("action", choices=["list", "verify", "build-sdk"], default="list", nargs="?")
    p_plug.set_defaults(func=cmd_plugin)

    p_mkt = sub.add_parser("marketplace", help="Browse Paid Plugin Marketplace & preview Stripe checkout")
    p_mkt.add_argument("--query", "-q", default="")
    p_mkt.add_argument("--tier", "-t", default="")
    p_mkt.add_argument("--checkout", default="", help="Plugin ID to preview 70/30 checkout & license")
    p_mkt.add_argument("--tenant", default="tnt-uniforge-core")
    p_mkt.set_defaults(func=cmd_marketplace)

    p_cloud = sub.add_parser("cloud", help="Manage UNIFORGE Cloud multi-tenant platform")
    p_cloud.add_argument("action", choices=["status", "up", "down", "create-tenant"], default="status", nargs="?")
    p_cloud.add_argument("--org", default="")
    p_cloud.add_argument("--tier", default="pro")
    p_cloud.add_argument("--region", default="us-central1")
    p_cloud.set_defaults(func=cmd_cloud)

    p_uni = sub.add_parser("unify", help="Analyze & unify a GitHub URL or local project path")
    p_uni.add_argument("target", help="GitHub repo URL or local directory")
    p_uni.set_defaults(func=cmd_unify)

    p_sb = sub.add_parser("sandbox", help="Preview or execute code inside a Zero-Trust Docker Sandbox")
    p_sb.add_argument("--language", "-l", default="python")
    p_sb.add_argument("--code", "-c", default="print('Hello from isolated sandbox')")
    p_sb.add_argument("--run", action="store_true")
    p_sb.set_defaults(func=cmd_sandbox)

    p_up = sub.add_parser("up", help="Start core infrastructure Docker stack")
    p_up.add_argument("--milvus", action="store_true")
    p_up.set_defaults(func=cmd_up)

    sub.add_parser("down", help="Stop all UNIFORGE Docker stacks").set_defaults(func=cmd_down)
    sub.add_parser("ps", help="List active Docker containers").set_defaults(func=cmd_ps)
    sub.add_parser("models", help="Start Local AI inference stack").set_defaults(func=cmd_models)
    sub.add_parser("auto", help="Start Automation stack").set_defaults(func=cmd_auto)
    sub.add_parser("monitor", help="Start Observability stack").set_defaults(func=cmd_monitor)
    sub.add_parser("creative", help="Serve Creative Coding & Game templates on port 8088").set_defaults(func=cmd_creative)
    sub.add_parser("agents", help="Execute all 5 AI agent orchestration demos").set_defaults(func=cmd_agents)
    sub.add_parser("datasets", help="List curated open-source datasets").set_defaults(func=cmd_datasets)
    sub.add_parser("test", help="Run automated pytest verification suite").set_defaults(func=cmd_test)
    sub.add_parser("validate", help="Validate syntax of all JSON & YAML configs").set_defaults(func=cmd_validate)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
