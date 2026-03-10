
from functools import lru_cache
from langchain_huggingface import HuggingFaceEmbeddings
@lru_cache(maxsize=1)
def get_embedding():
    try:
        return HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
    except Exception as e:
        raise RuntimeError(f"Embedding config error: {e}")  


# Singleton instance — import this everywhere
embedding = get_embedding()