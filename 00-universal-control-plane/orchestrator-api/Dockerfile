FROM python:3.11-slim
WORKDIR /app
COPY orchestrator-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY technology-registry /app/technology-registry
COPY studio-ui /app/studio-ui
COPY orchestrator-api /app/orchestrator-api
EXPOSE 7000
CMD ["uvicorn", "orchestrator-api.main:app", "--host", "0.0.0.0", "--port", "7000"]
