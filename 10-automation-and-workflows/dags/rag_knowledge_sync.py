from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator

def extract_docs():
    print("Extracting markdown documentation from 07-programming-knowledge-base...")
    return {"files_scanned": 14, "status": "extracted"}

def chunk_and_embed(**context):
    data = context["ti"].xcom_pull(task_ids="extract_docs")
    print(f"Generating 768-dim embeddings for {data['files_scanned']} documents...")
    return {"vectors_created": 128}

def upsert_qdrant(**context):
    stats = context["ti"].xcom_pull(task_ids="chunk_and_embed")
    print(f"Upserted {stats['vectors_created']} vectors into Qdrant collection 'devhub_docs'.")

default_args = {
    "owner": "universal-dev-hub",
    "retries": 1,
    "retry_delay": timedelta(minutes=2),
}

with DAG(
    dag_id="devhub_rag_knowledge_sync",
    default_args=default_args,
    description="Daily RAG indexing pipeline for Universal Dev Hub docs",
    schedule="@daily",
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=["rag", "ai", "devhub"],
) as dag:
    t1 = PythonOperator(task_id="extract_docs", python_callable=extract_docs)
    t2 = PythonOperator(task_id="chunk_and_embed", python_callable=chunk_and_embed)
    t3 = PythonOperator(task_id="upsert_qdrant", python_callable=upsert_qdrant)

    t1 >> t2 >> t3
