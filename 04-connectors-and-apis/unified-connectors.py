import os
import sys
import logging
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("UnifiedConnectors")

class UnifiedConnectors:
    """
    Enterprise multi-service connector wrapper.
    Provides verified client factories for AI Models, Databases, S3 Object Storage, and APIs.
    """

    def __init__(self):
        self._clients: Dict[str, Any] = {}

    # --- AI MODEL CLIENTS ---
    def get_openai_client(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY is not set.")
            return None
        try:
            from openai import OpenAI
            return OpenAI(api_key=api_key)
        except ImportError:
            logger.error("OpenAI package not installed. Run: pip install openai")
            return None

    def get_anthropic_client(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.warning("ANTHROPIC_API_KEY is not set.")
            return None
        try:
            import anthropic
            return anthropic.Anthropic(api_key=api_key)
        except ImportError:
            logger.error("Anthropic package not installed. Run: pip install anthropic")
            return None

    def get_gemini_client(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY is not set.")
            return None
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            return genai
        except ImportError:
            logger.error("google-generativeai package not installed. Run: pip install google-generativeai")
            return None

    # --- DATABASE CLIENTS ---
    def get_postgres_dsn(self) -> str:
        user = os.getenv("POSTGRES_USER", "devhub")
        password = os.getenv("POSTGRES_PASSWORD", "devhub_secure_pass")
        host = os.getenv("POSTGRES_HOST", "localhost")
        port = os.getenv("POSTGRES_PORT", "5432")
        db = os.getenv("POSTGRES_DB", "devhub_db")
        return f"postgresql://{user}:{password}@{host}:{port}/{db}"

    def get_redis_client(self):
        host = os.getenv("REDIS_HOST", "localhost")
        port = int(os.getenv("REDIS_PORT", "6379"))
        password = os.getenv("REDIS_PASSWORD", "devhub_redis_pass")
        try:
            import redis
            return redis.Redis(host=host, port=port, password=password, decode_responses=True)
        except ImportError:
            logger.error("Redis package not installed. Run: pip install redis")
            return None

    def get_qdrant_client(self):
        url = os.getenv("QDRANT_URL", "http://localhost:6333")
        try:
            from qdrant_client import QdrantClient
            return QdrantClient(url=url)
        except ImportError:
            logger.error("Qdrant client not installed. Run: pip install qdrant-client")
            return None

    def get_minio_client(self):
        endpoint = os.getenv("MINIO_ENDPOINT", "localhost:9000")
        access_key = os.getenv("MINIO_ROOT_USER", "devhub_admin")
        secret_key = os.getenv("MINIO_ROOT_PASSWORD", "devhub_minio_secret")
        try:
            import boto3
            return boto3.client(
                "s3",
                endpoint_url=f"http://{endpoint}",
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
                region_name="us-east-1"
            )
        except ImportError:
            logger.error("boto3 not installed. Run: pip install boto3")
            return None

    # --- HEALTH AUDIT ---
    def check_all_connectors(self) -> Dict[str, str]:
        results = {}
        # Redis check
        try:
            r = self.get_redis_client()
            if r:
                r.ping()
                results["redis"] = "CONNECTED"
            else:
                results["redis"] = "CLIENT_MISSING"
        except Exception as e:
            results["redis"] = f"FAILED: {e}"

        # S3 / MinIO check
        try:
            s3 = self.get_minio_client()
            if s3:
                s3.list_buckets()
                results["minio"] = "CONNECTED"
            else:
                results["minio"] = "CLIENT_MISSING"
        except Exception as e:
            results["minio"] = f"FAILED: {e}"

        results["postgres_dsn"] = self.get_postgres_dsn()
        results["openai_configured"] = "YES" if os.getenv("OPENAI_API_KEY") else "NO"
        results["anthropic_configured"] = "YES" if os.getenv("ANTHROPIC_API_KEY") else "NO"
        results["gemini_configured"] = "YES" if os.getenv("GEMINI_API_KEY") else "NO"

        logger.info(f"Connector Audit Summary: {results}")
        return results

if __name__ == "__main__":
    hub = UnifiedConnectors()
    print("=== Universal-Dev-Hub Connector Status ===")
    status = hub.check_all_connectors()
    for k, v in status.items():
        print(f"[{k}]: {v}")
