from pymongo import MongoClient
from dotenv import load_dotenv
import os


load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

MONG_URL = os.environ["MONG_URL"]
if not MONG_URL:
    raise RuntimeError("MONG_URL is undefined")

try:
    client = MongoClient(MONG_URL)
    db = client["resumeDataAgent"]
    embedding_db=db["resumeEmbeddings"]
    nlp_db=db["NLP_info"]
    
except Exception as e:
    raise RuntimeError(f"db connection python error: {e}")

