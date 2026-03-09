from langchain_huggingface import HuggingFaceEmbeddings

try:
    embedding=HuggingFaceEmbeddings(
     model_name="sentence-transformers/all-MiniLM-L6-v2"
)
except Exception as e:
    RuntimeError(f"emedding config error: {e}",)