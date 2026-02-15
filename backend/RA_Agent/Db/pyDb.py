from pymongo import MongoClient
import os
from ..env import env_path

MONG_URL = os.environ["MONG_URL"]
if not MONG_URL:
    raise RuntimeError("MONG_URL is undefined")

try:
    client = MongoClient(MONG_URL)
    db = client["resumeDataAgent"]
    embedding_db=db["resumeEmbeddings"]
    nlp_db=db["NLP_info"]
    print("db data created")
except Exception as e:
    raise RuntimeError(f"db connection python error: {e}")

print("Connected DB:", db.name)

print("collection",embedding_db.name)