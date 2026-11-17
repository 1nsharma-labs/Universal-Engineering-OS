# ==============================================================================
# UNIFORGE Control Plane API — Production Monorepo Image
# Build context: repository root (Universal-Dev-Hub/)
# ==============================================================================
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CONTROL_PLANE_PORT=7000 \
    PYTHONPATH=/app/00-universal-control-plane/orchestrator-api

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY 00-universal-control-plane/orchestrator-api/requirements.txt /app/00-universal-control-plane/orchestrator-api/requirements.txt
RUN pip install --no-cache-dir -r /app/00-universal-control-plane/orchestrator-api/requirements.txt

COPY 00-universal-control-plane/technology-registry /app/00-universal-control-plane/technology-registry
COPY 00-universal-control-plane/studio-ui /app/00-universal-control-plane/studio-ui
COPY 00-universal-control-plane/orchestrator-api /app/00-universal-control-plane/orchestrator-api
COPY 03-ai-models-and-inference /app/03-ai-models-and-inference
COPY 06-open-source-datasets /app/06-open-source-datasets
COPY 07-programming-knowledge-base /app/07-programming-knowledge-base
COPY marketplace /app/marketplace
COPY plugins /app/plugins
COPY docs /app/docs
COPY README.md ROADMAP.md ENTERPRISE.md SECURITY.md /app/

WORKDIR /app/00-universal-control-plane/orchestrator-api

EXPOSE 7000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD curl -fsS http://127.0.0.1:7000/api/v1/status || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7000"]
