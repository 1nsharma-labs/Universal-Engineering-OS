import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

app = FastAPI(
    title="Universal Dev Hub - High-Performance FastAPI Service",
    description="Asynchronous enterprise backend with Pydantic validation, CORS, and OpenAPI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthStatus(BaseModel):
    status: str
    service: str
    version: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    environment: str

class Item(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    price: float = Field(..., gt=0.0)
    in_stock: bool = True

# In-memory storage for rapid demonstration
ITEMS_DB: List[Item] = [
    Item(id=1, name="Universal AI Gateway", description="Multi-provider LLM proxy", price=49.99, in_stock=True),
    Item(id=2, name="PgVector Connector", description="PostgreSQL vector indexing module", price=29.99, in_stock=True)
]

@app.get("/health", response_model=HealthStatus, tags=["System"])
async def get_health():
    return HealthStatus(
        status="healthy",
        service="fastapi-starter",
        version="1.0.0",
        environment=os.getenv("APP_ENV", "development")
    )

@app.get("/api/v1/items", response_model=List[Item], tags=["Inventory"])
async def list_items():
    return ITEMS_DB

@app.post("/api/v1/items", response_model=Item, status_code=status.HTTP_201_CREATED, tags=["Inventory"])
async def create_item(item: Item):
    item.id = len(ITEMS_DB) + 1
    ITEMS_DB.append(item)
    return item

@app.get("/api/v1/items/{item_id}", response_model=Item, tags=["Inventory"])
async def get_item(item_id: int):
    for item in ITEMS_DB:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
