from fastapi import FastAPI, APIRouter, HTTPException, Query, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import io
import base64
import uuid
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import jwt
import qrcode

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

TOTAL_NUMBERS = 500
PRICE_PER_NUMBER = 5.0
JWT_ALGORITHM = "HS256"

PIX_CNPJ = "65836767000109"

PRIZES = [
    "Smart Watch X10 Ultra 3",
    "Apple AirPods Pro 3ª Geração",
    "Carregador Turbo 120W Samsung",
    "Caixa de Som Bluetooth",
]


def _emv(field_id: str, value: str) -> str:
    return f"{field_id}{len(value):02d}{value}"


def _crc16(payload: str) -> str:
    crc = 0xFFFF
    for ch in payload:
        crc ^= ord(ch) << 8
        for _ in range(8):
            if crc & 0x8000:
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF
            else:
                crc = (crc << 1) & 0xFFFF
    return format(crc, "04X")


class OrderCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=8, max_length=20)
    numbers: List[int] = Field(min_length=1, max_length=100)


class AdminLogin(BaseModel):
    password: str


class WinnersUpdate(BaseModel):
    winners: List[Optional[int]] = Field(min_length=4, max_length=4)


def create_admin_token() -> str:
    payload = {
        "sub": "admin",
        "type": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def require_admin(request: Request):
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else ""
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "admin":
            raise ValueError("bad type")
    except Exception:
        raise HTTPException(status_code=401, detail="Não autorizado.")


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
    results = None
    winners_cfg = config.get("winners")
    if config.get("results_published") and winners_cfg:
        full_orders = await db.orders.find({}, {"_id": 0, "numbers": 1, "name": 1}).to_list(10000)
        results = []
        for i, w in enumerate(winners_cfg):
            holder = next(
                (o for o in full_orders if w is not None and w in o.get("numbers", [])), None
            )
            results.append({
                "prize": PRIZES[i] if i < len(PRIZES) else f"Prêmio {i + 1}",
                "number": w,
                "winner_name": holder["name"] if holder else None,
            })
    return {
        "total_numbers": TOTAL_NUMBERS,
        "price_per_number": PRICE_PER_NUMBER,
        "deadline": config["deadline"],
        "taken_numbers": taken,
        "sold_count": len(taken),
        "available_count": TOTAL_NUMBERS - len(taken),
        "results": results,
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


@api_router.get("/pix")
async def pix_code(amount: float = Query(..., gt=0), txid: str = Query("RIFA")):
    txid = re.sub(r"[^A-Za-z0-9]", "", txid)[:20] or "RIFA"
    payload = (
        _emv("00", "01")
        + _emv("26", _emv("00", "br.gov.bcb.pix") + _emv("01", PIX_CNPJ))
        + _emv("52", "0000")
        + _emv("53", "986")
        + _emv("54", f"{amount:.2f}")
        + _emv("58", "BR")
        + _emv("59", "MQ ASSISTENCIA")
        + _emv("60", "BRASIL")
        + _emv("62", _emv("05", txid))
        + "6304"
    )
    payload += _crc16(payload)
    img = qrcode.make(payload)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_base64 = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
    return {"payload": payload, "qr_base64": qr_base64, "amount": round(amount, 2)}


@api_router.post("/admin/login")
async def admin_login(input: AdminLogin):
    if input.password != os.environ.get("ADMIN_PASSWORD"):
        raise HTTPException(status_code=401, detail="Senha incorreta.")
    return {"token": create_admin_token()}


@api_router.get("/admin/stats")
async def admin_stats(request: Request):
    require_admin(request)
    orders = await db.orders.find({}, {"_id": 0}).to_list(10000)
    paid = [o for o in orders if o.get("status") == "pago"]
    pending = [o for o in orders if o.get("status") != "pago"]
    sold = sum(len(o.get("numbers", [])) for o in orders)
    return {
        "total_numbers": TOTAL_NUMBERS,
        "sold": sold,
        "available": TOTAL_NUMBERS - sold,
        "paid_orders": len(paid),
        "pending_orders": len(pending),
        "paid_revenue": round(sum(o["total"] for o in paid), 2),
        "pending_revenue": round(sum(o["total"] for o in pending), 2),
    }


@api_router.get("/admin/orders")
async def admin_orders(request: Request):
    require_admin(request)
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    return {"orders": orders}


@api_router.post("/admin/orders/{order_id}/paid")
async def admin_mark_paid(order_id: str, request: Request):
    require_admin(request)
    res = await db.orders.update_one({"id": order_id}, {"$set": {"status": "pago"}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")
    return {"ok": True}


@api_router.delete("/admin/orders/{order_id}")
async def admin_delete_order(order_id: str, request: Request):
    require_admin(request)
    res = await db.orders.delete_one({"id": order_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")
    return {"ok": True}


@api_router.get("/admin/winners")
async def admin_get_winners(request: Request):
    require_admin(request)
    config = await db.raffle_config.find_one({"key": "main"}, {"_id": 0})
    winners = (config or {}).get("winners") or [None, None, None, None]
    return {
        "prizes": PRIZES,
        "winners": winners,
        "published": bool((config or {}).get("results_published")),
    }


class PublishUpdate(BaseModel):
    published: bool


@api_router.put("/admin/results")
async def admin_publish_results(input: PublishUpdate, request: Request):
    require_admin(request)
    if input.published:
        config = await db.raffle_config.find_one({"key": "main"})
        winners = (config or {}).get("winners") or []
        if len([w for w in winners if w is not None]) < 4:
            raise HTTPException(
                status_code=400,
                detail="Defina os 4 números ganhadores antes de publicar o resultado.",
            )
    await db.raffle_config.update_one(
        {"key": "main"}, {"$set": {"results_published": input.published}}, upsert=True
    )
    return {"ok": True, "published": input.published}


@api_router.put("/admin/winners")
async def admin_set_winners(input: WinnersUpdate, request: Request):
    require_admin(request)
    nums = [n for n in input.winners if n is not None]
    if any(n < 1 or n > TOTAL_NUMBERS for n in nums):
        raise HTTPException(status_code=400, detail="Números devem estar entre 1 e 500.")
    if len(set(nums)) != len(nums):
        raise HTTPException(status_code=400, detail="Os números ganhadores devem ser diferentes entre si.")
    await db.raffle_config.update_one(
        {"key": "main"}, {"$set": {"winners": input.winners}}, upsert=True
    )
    return {"ok": True, "winners": input.winners}


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
