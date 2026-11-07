from functools import lru_cache

from dotenv import load_dotenv
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Load environment variables
load_dotenv()
model_name = os.environ["EMBEDDING_NAME"]

@lru_cache(maxsize=1)
def get_embedding():
    try:
        cleint =  GoogleGenerativeAIEmbeddings(
    model=model_name,
    output_dimensionality=384,
)
      
        return cleint
    except Exception as e:
        raise RuntimeError(f"Embedding config error: {e}")
