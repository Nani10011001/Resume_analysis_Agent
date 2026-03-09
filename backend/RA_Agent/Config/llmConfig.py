from langchain_groq import ChatGroq
import os
__llm=None
from functools import lru_cache # help use to call function one use it everwhere of it
@lru_cache
def get_llm():
    global __llm#If a variable is assigned anywhere inside a function,
#Python treats it as a local variable.
    Groq_api_key=os.environ.get("GROQ_API_KEY")
    if not Groq_api_key:
        raise ValueError("groq_api_key is undefined")
    try:
        if __llm is None:
            __llm=ChatGroq(model="",api_key=Groq_api_key,streaming=True)
        return __llm
    except Exception as e:
        raise RuntimeError("connection error  in llm: ",e)