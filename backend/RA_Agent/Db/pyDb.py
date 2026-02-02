from pymongo import MongoClient
import os
from .. import env

MONG_URL = os.environ["MONG_URL"]
if not MONG_URL:
    raise RuntimeError("MONG_URL is undefined")

try:
    client = MongoClient(MONG_URL)
    db = client["resumeDataAgent"]
    print("db data created")
except Exception as e:
    raise RuntimeError(f"db connection python error: {e}")

resume_collection = db["resumeAgentState"]
print("Connected DB:", db.name)
print("Collection:", resume_collection.name)