from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import uuid
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

TOTAL_NUMBERS = 500
PRICE_PER_NUMBER = 5.0


class OrderCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=8, max_length=20)
    numbers: List[int] = Field(min_length=1, max_length=100)


@api_router.get("/")
async def root():
    return {"message": "MQ Rifa API"}


@api_router.get("/raffle")
async def get_raffle():
    config = await db.raffle_config.find_one({"key": "main"}, {"_id": 0})
    if not config:
        deadline = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
        config = {"key": "main", "deadline": deadline}
        await db.raffle_config.insert_one(config)
    orders = await db.orders.find({}, {"_id": 0, "numbers": 1}).to_list(10000)
    taken = sorted({n for o in orders for n in o.get("numbers", [])})
    return {
        "total_numbers": TOTAL_NUMBERS,
        "price_per_number": PRICE_PER_NUMBER,
        "deadline": config["deadline"],
        "taken_numbers": taken,
        "sold_count": len(taken),
        "available_count": TOTAL_NUMBERS - len(taken),
    }


@api_router.post("/orders")
async def create_order(input: OrderCreate):
    numbers = sorted(set(input.numbers))
    if any(n < 1 or n > TOTAL_NUMBERS for n in numbers):
        raise HTTPException(status_code=400, detail="Números inválidos.")
    conflicts = await db.orders.find(
        {"numbers": {"$in": numbers}}, {"_id": 0, "numbers": 1}
    ).to_list(1000)
    if conflicts:
        clash = sorted({n for o in conflicts for n in o["numbers"]} & set(numbers))
        raise HTTPException(
            status_code=409,
            detail={"message": "Alguns números já foram reservados.", "numbers": clash},
        )
    order = {
        "id": str(uuid.uuid4()),
        "name": input.name.strip(),
        "phone": re.sub(r"\D", "", input.phone),
        "numbers": numbers,
        "total": round(len(numbers) * PRICE_PER_NUMBER, 2),
        "status": "aguardando_pagamento",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.orders.insert_one(order)
    return {k: v for k, v in order.items() if k != "_id"}


@api_router.get("/orders/lookup")
async def lookup_orders(phone: str = Query(...)):
    digits = re.sub(r"\D", "", phone)
    if len(digits) < 8:
        raise HTTPException(status_code=400, detail="Telefone inválido.")
    orders = await db.orders.find({"phone": digits}, {"_id": 0}).to_list(100)
    return {"orders": orders}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
