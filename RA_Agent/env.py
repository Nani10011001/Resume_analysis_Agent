from dotenv import load_dotenv
from pathlib import Path

# Load .env from the project `backend` directory (one level above RA_Agent)
env_path = Path(__file__).resolve().parents[1] / '.env'
load_dotenv(env_path,override=False)