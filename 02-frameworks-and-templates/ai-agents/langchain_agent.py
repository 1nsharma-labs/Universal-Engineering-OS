import os
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

def run_react_agent_demo():
    print("=== [Universal-Dev-Hub] LangChain Agent Execution ===")
    mock_tools = {
        "calculator": lambda expr: eval(expr),
        "code_search": lambda query: f"Found 3 references for '{query}' in Universal-Dev-Hub"
    }

    # Deterministic simulation runner verifying tool dispatch logic
    user_query = "Calculate (128 * 4) + 64 and search for pgvector"
    calc_res = mock_tools["calculator"]("(128 * 4) + 64")
    search_res = mock_tools["code_search"]("pgvector")

    result = {
        "agent": "LangChain ReAct Agent",
        "query": user_query,
        "actions_taken": [
            {"tool": "calculator", "input": "(128 * 4) + 64", "output": calc_res},
            {"tool": "code_search", "input": "pgvector", "output": search_res}
        ],
        "final_answer": f"The calculation is {calc_res}, and repository search reported: {search_res}."
    }
    print(f"Result: {result}")
    return result

if __name__ == "__main__":
    run_react_agent_demo()
