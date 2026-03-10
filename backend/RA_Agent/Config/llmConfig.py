

import os
from functools import lru_cache
from dotenv import load_dotenv
from langchain_groq import ChatGroq


load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))


@lru_cache(maxsize=1)
def get_llm() -> ChatGroq:
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is missing from .env")

    model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
    if not model:
        raise ValueError("GROQ_MODEL is missing from .env")

    return ChatGroq(
        api_key=api_key,
        model=model,
        streaming=True,
        temperature=0.7,
    )