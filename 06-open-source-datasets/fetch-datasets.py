import os
import sys
import argparse
import yaml
from pathlib import Path

CATALOG_PATH = Path(__file__).parent / "dataset-catalog.yaml"

def load_catalog():
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def list_datasets():
    catalog = load_catalog()
    print("=== Available Open-Source Datasets ===")
    for category, items in catalog.get("datasets", {}).items():
        print(f"\n[{category.upper()}]:")
        for d in items:
            hf_id = d.get("huggingface_id", "N/A")
            print(f"  - {d['id']:25} | Name: {d['name']} (HF: {hf_id})")

def stream_huggingface_dataset(dataset_id: str, split: str = "train", limit: int = 100):
    """
    Stream a sample slice of a HuggingFace dataset without downloading gigabytes of raw data.
    """
    print(f"Streaming {limit} rows from HuggingFace dataset '{dataset_id}' ({split} split)...")
    try:
        from datasets import load_dataset
        ds = load_dataset(dataset_id, split=split, streaming=True)
        count = 0
        samples = []
        for sample in ds:
            samples.append(sample)
            count += 1
            if count >= limit:
                break
        print(f"Successfully streamed {len(samples)} records.")
        out_file = Path("data") / f"{dataset_id.replace('/', '_')}_sample.json"
        out_file.parent.mkdir(exist_ok=True)
        import json
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(samples, f, indent=2, default=str)
        print(f"Saved sample records to: {out_file}")
    except ImportError:
        print("Error: 'datasets' package not installed. Run: pip install datasets")
    except Exception as e:
        print(f"Failed to stream dataset: {e}")

def main():
    parser = argparse.ArgumentParser(description="Universal Dev Hub Dataset Fetcher")
    parser.add_argument("--list", action="store_true", help="List available datasets in catalog")
    parser.add_argument("--stream", type=str, help="HuggingFace dataset ID to stream")
    parser.add_argument("--limit", type=int, default=50, help="Number of records to stream")
    args = parser.parse_args()

    if args.list:
        list_datasets()
    elif args.stream:
        stream_huggingface_dataset(args.stream, limit=args.limit)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
