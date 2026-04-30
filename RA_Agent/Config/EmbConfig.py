from functools import lru_cache
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
import os
from huggingface_hub import InferenceClient
# Load environment variables
load_dotenv()
hf_token = os.getenv("HF_TOKEN")

@lru_cache(maxsize=1)
def get_embedding():
    try:
        cleint = InferenceClient(token=hf_token)
      
        return cleint
    except Exception as e:
        raise RuntimeError(f"Embedding config error: {e}")

