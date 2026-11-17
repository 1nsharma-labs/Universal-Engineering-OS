from typing import Dict, Any

class StateGraph:
    def __init__(self):
        self.nodes = {}
        self.state = {}

    def add_node(self, name: str, func):
        self.nodes[name] = func

    def run(self, initial_state: Dict[str, Any]) -> Dict[str, Any]:
        self.state = initial_state
        for node_name, node_func in self.nodes.items():
            print(f"Executing LangGraph Node: {node_name}")
            self.state = node_func(self.state)
        return self.state

def plan_node(state: Dict[str, Any]) -> Dict[str, Any]:
    state["plan"] = ["validate_schema", "execute_query", "format_output"]
    return state

def execute_node(state: Dict[str, Any]) -> Dict[str, Any]:
    state["execution"] = "Successfully queried pgvector embeddings index"
    return state

def verify_node(state: Dict[str, Any]) -> Dict[str, Any]:
    state["verified"] = True
    return state

def run_langgraph_demo():
    print("=== [Universal-Dev-Hub] LangGraph Cyclic StateGraph Workflow ===")
    graph = StateGraph()
    graph.add_node("planner", plan_node)
    graph.add_node("executor", execute_node)
    graph.add_node("verifier", verify_node)

    final_state = graph.run({"task": "semantic_search_rag"})
    print(f"Final Graph State: {final_state}")
    return final_state

if __name__ == "__main__":
    run_langgraph_demo()
