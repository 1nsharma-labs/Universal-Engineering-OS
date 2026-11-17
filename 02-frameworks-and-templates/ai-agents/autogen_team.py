from typing import List, Dict, Any

class AutoGenSimAgent:
    def __init__(self, name: str, system_message: str):
        self.name = name
        self.system_message = system_message

    def send(self, message: str) -> Dict[str, str]:
        return {"sender": self.name, "message": message}

def run_autogen_demo():
    print("=== [Universal-Dev-Hub] Microsoft AutoGen Multi-Agent Conversation ===")
    user_proxy = AutoGenSimAgent("UserProxy", "Initiates code generation and reviews unit tests.")
    coder = AutoGenSimAgent("CoderAgent", "Writes Python and TypeScript according to specifications.")
    critic = AutoGenSimAgent("CriticAgent", "Validates edge cases, linting, and security constraints.")

    dialogue = [
        user_proxy.send("Generate a resilient Redis connection pool with exponential backoff."),
        coder.send("Implemented redis.ConnectionPool with max_connections=50 and retry=Retry(ExponentialBackoff())."),
        critic.send("Code verified: connection timeout, socket keepalive, and error boundary tests all pass.")
    ]

    for turn in dialogue:
        print(f"[{turn['sender']}]: {turn['message']}")

    return dialogue

if __name__ == "__main__":
    run_autogen_demo()
