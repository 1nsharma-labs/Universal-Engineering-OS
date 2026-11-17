import json
from pathlib import Path

HUB_ROOT = Path(__file__).resolve().parents[2]

def test_model_registry_valid_json():
    registry_path = HUB_ROOT / "03-ai-models-and-inference" / "model-registry.json"
    assert registry_path.exists()
    data = json.loads(registry_path.read_text(encoding="utf-8"))
    assert "models" in data
    assert len(data["models"]["large_language_models"]) >= 3

def test_mcp_config_valid_json():
    mcp_path = HUB_ROOT / "05-mcp-servers-hub" / "mcp-config.json"
    assert mcp_path.exists()
    data = json.loads(mcp_path.read_text(encoding="utf-8"))
    assert "mcpServers" in data
    assert "filesystem" in data["mcpServers"]
    assert "postgres" in data["mcpServers"]

def test_design_tokens_valid_json():
    tokens_path = HUB_ROOT / "11-ui-ux-and-design-assets" / "design-tokens.json"
    assert tokens_path.exists()
    data = json.loads(tokens_path.read_text(encoding="utf-8"))
    assert "color" in data and "typography" in data
