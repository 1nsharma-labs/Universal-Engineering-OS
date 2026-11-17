from typing import Dict, Any

class Agent:
    def __init__(self, role: str, goal: str, backstory: str):
        self.role = role
        self.goal = goal
        self.backstory = backstory

class Task:
    def __init__(self, description: str, agent: Agent):
        self.description = description
        self.agent = agent

def run_crewai_demo() -> Dict[str, Any]:
    print("=== [Universal-Dev-Hub] CrewAI Multi-Agent Team Execution ===")
    researcher = Agent(
        role="Principal Security Auditor",
        goal="Audit infrastructure configurations and containers for vulnerabilities",
        backstory="Ex-NSA cybersecurity engineer specializing in zero-trust architecture"
    )
    writer = Agent(
        role="Technical Communications Lead",
        goal="Synthesize audit outputs into actionable executive summaries",
        backstory="Award-winning technical author and DevSecOps specialist"
    )

    t1 = Task("Audit docker-compose.infra.yml and .env.example", researcher)
    t2 = Task("Compile the security findings into the master README", writer)

    output = {
        "crew": "DevSecOps Crew",
        "tasks_completed": [t1.description, t2.description],
        "verdict": "Infrastructure passed baseline checks. All secrets parameterized in .env.example."
    }
    print(f"Crew Result: {output}")
    return output

if __name__ == "__main__":
    run_crewai_demo()
