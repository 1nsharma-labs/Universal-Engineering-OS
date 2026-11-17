# ==============================================================================
# UNIFORGE (uniforge-os / Universal-Engineering-OS) — Single Command Control Center
# ==============================================================================

.PHONY: help version init studio validate test wiki plugin-sdk plugins marketplace cloud-status cloud-up cloud-down sync-status up down ps models java react creative backend agents auto monitor mcps datasets audit clean

help:
	@echo "======================================================================"
	@echo "     UNIFORGE (uniforge-os) — UNIVERSAL ENGINEERING OS CONTROLLER     "
	@echo "======================================================================"
	@echo "  make version      - Display UNIFORGE OS version & environment"
	@echo "  make init         - Verify polyglot toolchains & copy .env template"
	@echo "  make studio       - Launch Operational Studio & Control Plane (:7000)"
	@echo "  make validate     - Validate all JSON & YAML manifests across repo"
	@echo "  make test         - Run end-to-end automated pytest test suite"
	@echo "  make wiki         - List all 60+ Universal Wiki technology profiles"
	@echo "  make plugin-sdk   - Build & unit-test @uniforge/plugin-sdk"
	@echo "  make plugins      - List & validate the 5 Official UNIFORGE Plugins"
	@echo "  make marketplace  - Browse Paid Plugin Marketplace (70/30 Rev-Share)"
	@echo "  make cloud-status - Inspect UNIFORGE Cloud multi-tenant control plane"
	@echo "  make cloud-up     - Deploy UNIFORGE Cloud multi-tenant Docker stack"
	@echo "  make cloud-down   - Stop UNIFORGE Cloud multi-tenant stack"
	@echo "  make sync-status  - Check Hybrid Local <-> Self-Hosted Cloud sync"
	@echo "  make up           - Spin up Core Databases & Infrastructure Stack"
	@echo "  make down         - Stop all running containers and services"
	@echo "  make ps           - List all active container stacks"
	@echo "  make models       - Spin up Local AI Inference Stack (Ollama, vLLM)"
	@echo "  make java         - Build & test multi-module Java ecosystem"
	@echo "  make react        - Launch Vite React Dashboard development server"
	@echo "  make creative     - Launch local server for p5.js, Three.js & D3"
	@echo "  make backend      - Launch FastAPI backend service locally"
	@echo "  make agents       - Run multi-agent AI execution simulations"
	@echo "  make auto         - Spin up n8n & Airflow automation stack"
	@echo "  make monitor      - Spin up Prometheus, Grafana, and Langfuse"
	@echo "  make mcps         - Install and verify Model Context Protocol servers"
	@echo "  make datasets     - Inspect curated open-source dataset catalog"
	@echo "  make audit        - Run automated DevSecOps vulnerability audit"
	@echo "  make clean        - Clean dangling containers and temporary files"
	@echo "======================================================================"

version:
	@python devhub.py version

init:
	@python devhub.py init

studio:
	@echo "--> Starting UNIFORGE Operational Studio at http://localhost:7000..."
	@python devhub.py studio --port 7000

validate:
	@python devhub.py validate

test:
	@python devhub.py test

wiki:
	@python devhub.py wiki

plugin-sdk:
	@python devhub.py plugin build-sdk

plugins:
	@python devhub.py plugin list
	@python devhub.py plugin verify

marketplace:
	@python devhub.py marketplace

cloud-status:
	@python devhub.py cloud status

cloud-up:
	@python devhub.py cloud up

cloud-down:
	@python devhub.py cloud down

sync-status:
	@bash 00-universal-control-plane/hybrid-sync/sync-hybrid.sh status

up:
	@python devhub.py up

down:
	@python devhub.py down

ps:
	@python devhub.py ps

models:
	@python devhub.py models

java:
	@echo "--> Building Java Ecosystem..."
	cd 02-frameworks-and-templates/java-ecosystem && mvn clean compile test-compile

react:
	@echo "--> Launching React + Zustand + TanStack Query Console..."
	cd 02-frameworks-and-templates/react-and-frontend/vite-react-ts && npm run dev

creative:
	@python devhub.py creative

backend:
	@echo "--> Launching FastAPI Engine..."
	cd 02-frameworks-and-templates/backend-apis/fastapi-starter && uvicorn main:app --reload --port 8000

agents:
	@python devhub.py agents

auto:
	@python devhub.py auto

monitor:
	@python devhub.py monitor

mcps:
	@bash 05-mcp-servers-hub/install-mcps.sh

datasets:
	@python devhub.py datasets

audit:
	@bash 09-testing-and-security/security-audit.sh

clean:
	@echo "--> Pruning build artifacts and dangling containers..."
	docker system prune -f
