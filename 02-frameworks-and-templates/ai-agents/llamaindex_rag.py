import os
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

class InMemoryRAGEngine:
    def __init__(self, documents: List[str]):
        self.documents = documents

    def query(self, prompt: str) -> Dict[str, Any]:
        # Keyword-grounded retrieval matching
        matches = [doc for doc in self.documents if any(k in doc.lower() for k in prompt.lower().split())]
        context = " \n".join(matches) if matches else "No relevant context found."
        return {
            "query": prompt,
            "retrieved_context": context,
            "synthesized_response": f"Based on retrieved documentation: {context}"
        }

def run_llamaindex_demo():
    print("=== [Universal-Dev-Hub] LlamaIndex RAG Pipeline ===")
    knowledge_base = [
        "Universal-Dev-Hub supports PostgreSQL 16 with pgvector extension enabled on port 5432.",
        "Local LLM inference runs via Ollama on port 11434 and vLLM on port 8000.",
        "Qdrant vector database indexes high-dimensional embeddings on port 6333."
    ]
    rag = InMemoryRAGEngine(knowledge_base)
    response = rag.query("What port does Ollama run on?")
    print(f"RAG Response: {response['synthesized_response']}")
    return response

if __name__ == "__main__":
    run_llamaindex_demo()
