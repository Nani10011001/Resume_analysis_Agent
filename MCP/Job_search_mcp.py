import os
import logging
from dotenv import load_dotenv
from fastmcp import FastMCP
from langsmith import traceable
from exa_py import Exa
import threading
load_dotenv(os.path.join(os.path.dirname(__file__), "./.env"))
import asyncio
from fastmcp import Client
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("websearch-mcp")

EXA_API_KEY = os.environ.get("EXA_API_KEY")
if not EXA_API_KEY:
    raise EnvironmentError("EXA_API_KEY not set.")

mcp = FastMCP("websearch")

@traceable(name="job_mcp")
@mcp.tool()
async def web_search(query: str) -> str:      
    """Search for job listings and return direct links."""
    logger.info(f"Searching: {query}")
    try:
        client_exa = Exa(api_key=EXA_API_KEY)

        results = client_exa.search_and_contents(  
            f"{query} job opening 2025",
            num_results=5,
            type="keyword",
            include_domains=[
                "linkedin.com",
                "indeed.com",
                "glassdoor.com",
                "wellfound.com",
                "archinect.com"
            ],
            text={"max_characters": 150}
        )

        if not results.results:
            return "No job listings found."

        bad_sites = ["flexionis", "wuaze", "redirect", "track"]
        output = []
        for r in results.results:
            if any(bad in r.url for bad in bad_sites):
                continue
            output.append(f"- {r.title}\n  🔗 {r.url}")

        return "\n".join(output) if output else "No direct listings found."

    except Exception as e:
        logger.error(f"Search failed: {e}")
        return f"Search error: {str(e)}"

if __name__ == "__main__":
    logger.info("Starting MCP server...")
 
async def health_check():
    async with Client("https://resume-analysis-agent-5.onrender.com/mcp") as client:
        await client.ping()
        print("MCP server is healthy")

asyncio.run(health_check())