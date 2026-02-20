from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import sys
import os
from pydantic import BaseModel
from backend.models.model_1_crop_yield_estimation.src.local_adjustment.apply_adjustment import apply_adjustment
from backend.models.model_1_crop_yield_estimation.src.confidence.confidence_score import confidence_score
from backend.models.model_2_agro_impact.src.predict_impact import predict_agro_impact
from backend.models.model_2_agro_impact.src.feature_builder import build_feature_vector
from backend.models.model_3_market_price.src.price_intelligence import get_price_intelligence
from backend.models.model_4_sell_recommedation.src.recommendation import get_sell_recommendation
from backend.api.firebase_auth import is_firebase_configured, verify_firebase_id_token
class CropRequest(BaseModel):
    Crop: str = "Wheat"
    Season: str = "Rabi"
    State: str = "Punjab"
    Crop_Year: int = 2023
    Area: float = 2.5
    Production: float = 6.0
    Annual_Rainfall: float = 800.0
    fertilizer_per_area: float = 120.0
    pesticide_per_area: float = 2.0
    soil_type: str = "Loamy"
    rainfall_deviation: float = 5.0


class CropResponse(BaseModel):
    base_yield: float
    adjusted_yield: float
    confidence: float


class AgroImpactRequest(BaseModel):
    N: float = 90.0
    P: float = 40.0
    K: float = 40.0
    temperature: float = 25.0
    humidity: float = 60.0
    ph: float = 6.5
    rainfall: float = 100.0
    soil_moisture: float = 30.0
    soil_type: int = 1
    sunlight_exposure: float = 8.0
    wind_speed: float = 5.0
    co2_concentration: float = 400.0
    organic_matter: float = 2.0
    irrigation_frequency: float = 2.0
    crop_density: float = 1.5
    pest_pressure: float = 0.5
    fertilizer_usage: float = 100.0
    growth_stage: int = 2
    urban_area_proximity: float = 10.0
    water_source_type: int = 1
    frost_risk: float = 0.1
    water_usage_efficiency: float = 0.8


class AgroImpactLiteRequest(BaseModel):
    latitude: float = 30.7333
    longitude: float = 76.7794
    crop: str = "Wheat"
    sowing_date: str = "2023-11-01"
    pest_level: str = "Low"


class RiskInput(BaseModel):
    weather_volatility: float = 0.7
    price_fluctuation: float = 0.5
    crop_sensitivity: int = 2


class LivestockInput(BaseModel):
    movement: float = 1.2
    feeding: int = 3
    resting: float = 6.0
    temperature: float = 25.0

class PriceRequest(BaseModel):
    crop: str = "Wheat"
    mandi: str | None = "Jhansi"
    zip_code: str | None = "284135"
    country_code: str = "IN"
    days: int = 7

class SellRequest(BaseModel):
    crop: str = "Wheat"
    mandi: str | None = "Jhansi"
    zip_code: str | None = "284135"
    days: int = 7
    weather_input: dict = {"temperature": 25.0, "humidity": 60.0, "rainfall": 100.0}


class FirebaseTokenRequest(BaseModel):
    id_token: str = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2ODg4In0.eyJpc3MiOiJodHRwczovL2ZpcmViYXNlYXBwLmNvbS8iLCJhdWQiOiJteWFwcCIsInN1YiI6InVzZXIxMjMifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

# ================================
# BASE DIRECTORY SETUP
# ================================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# ================================
# MODEL 1 - CROP YIELD MODEL
# ================================
MODEL_1_PATH = os.path.join(
    BASE_DIR,
    "models",
    "model_1_crop_yield_estimation"
)

sys.path.append(MODEL_1_PATH)



CROP_MODEL_PATH = os.path.join(
    MODEL_1_PATH,
    "models",
    "base_crop_yield_model.pkl"
)

crop_model = joblib.load(CROP_MODEL_PATH)

# ================================
# MODEL 2 - AGRO IMPACT MODEL
# ================================
MODEL_2_PATH = os.path.join(
    BASE_DIR,
    "models",
    "model_2_agro_impact"
)

sys.path.append(MODEL_2_PATH)

# ================================
# MODEL 5 - CROP RISK MODEL
# ================================
RISK_MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "model_5_crop_risk_model",
    "models",
    "risk_model.pkl"
)

risk_model = joblib.load(RISK_MODEL_PATH)

# ================================
# MODEL 6 - LIVESTOCK HEALTH MODEL
# ================================
LIVESTOCK_MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "model_6_livestock_health_model",
    "models",
    "livestock_health_model.pkl"
)

LIVESTOCK_ENCODER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "model_6_livestock_health_model",
    "models",
    "label_encoder.pkl"
)

livestock_model = joblib.load(LIVESTOCK_MODEL_PATH)
livestock_label_encoder = joblib.load(LIVESTOCK_ENCODER_PATH)

# ================================
# FASTAPI INIT
# ================================

from fastapi import WebSocket, WebSocketDisconnect
import asyncio
import random

app = FastAPI(
    title="Farm+ AI API",
    version="1.0"
)

# ================================
# REAL-TIME MARKET PRICE WEBSOCKET
# ================================
market_ws_clients = set()

@app.websocket("/ws/market")
async def market_price_ws(websocket: WebSocket):
    await websocket.accept()
    market_ws_clients.add(websocket)
    try:
        while True:
            # Keep connection alive; optionally receive pings
            await websocket.receive_text()
    except WebSocketDisconnect:
        market_ws_clients.remove(websocket)

# Helper to broadcast price updates to all connected clients
async def broadcast_market_price(price_data: dict):
    to_remove = set()
    for ws in market_ws_clients:
        try:
            await ws.send_json(price_data)
        except Exception:
            to_remove.add(ws)
    for ws in to_remove:
        market_ws_clients.discard(ws)

# ================================
# DEMO: BACKGROUND TASK FOR PRICE UPDATES
# ================================
from backend.models.model_3_market_price.src.agmarknet_api import fetch_agmarknet_data
# Native FastAPI background task for periodic price updates using Agmarknet
@app.on_event("startup")
async def start_price_update_task():
    async def price_update_loop():
        while True:
            try:
                # Example: fetch latest wheat price from Delhi mandi
                df = fetch_agmarknet_data(commodity="Wheat", market="Delhi", state="Delhi")
                if not df.empty:
                    latest = df.sort_values("Price_Date").iloc[-1]
                    price = latest["Modal_Price"]
                    change = 0  # Could be calculated from previous day
                    changeType = 'neutral'
                    current = price
                    target = price
                    maxv = price
                    importExport = 0
                    forecast = 'Live'
                    await broadcast_market_price({
                        'price': price,
                        'change': abs(change),
                        'changeType': changeType,
                        'current': current,
                        'target': target,
                        'max': maxv,
                        'importExport': importExport,
                        'forecast': forecast,
                        'commodity': latest["Commodity"],
                        'market': latest["Market"],
                        'state': latest["State"],
                        'date': latest["Price_Date"]
                    })
                else:
                    # fallback to random demo data
                    price = random.randint(2100, 2300)
                    change = random.randint(-50, 50)
                    changeType = 'positive' if change >= 0 else 'negative'
                    current = random.randint(250, 350)
                    target = 2500
                    maxv = random.randint(100, 200)
                    importExport = round(random.uniform(5.5, 7.0), 1)
                    forecast = random.choice(['High', 'Mid', 'Low'])
                    await broadcast_market_price({
                        'price': price,
                        'change': abs(change),
                        'changeType': changeType,
                        'current': current,
                        'target': target,
                        'max': maxv,
                        'importExport': importExport,
                        'forecast': forecast
                    })
            except Exception as e:
                print(f"Agmarknet fetch error: {e}")
            await asyncio.sleep(10)
    import asyncio
    loop = asyncio.get_event_loop()
    loop.create_task(price_update_loop())

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================================
# HELPER FUNCTION
# ================================
def predict_base_yield(input_dict):
    df = pd.DataFrame([input_dict])
    log_pred = crop_model.predict(df)[0]
    return float(np.expm1(log_pred))


# ================================
# ENDPOINTS
# ================================

# 🌾 Crop Yield
@app.post("/predict", response_model=CropResponse)
def predict_crop_yield(data: CropRequest):

    input_data = data.dict()

    soil_type = input_data.pop("soil_type")
    rainfall_deviation = input_data.pop("rainfall_deviation")

    base_yield = predict_base_yield(input_data)

    adjusted_yield = apply_adjustment(
        base_yield,
        soil_type,
        rainfall_deviation
    )

    processed_input = crop_model.named_steps["preprocessor"].transform(
        pd.DataFrame([input_data])
    )

    conf = confidence_score(
        crop_model.named_steps["regressor"],
        processed_input
    )

    conf_value = float(conf[0]) if hasattr(conf, '__getitem__') else float(conf)

    return {
        "base_yield": round(base_yield, 2),
        "adjusted_yield": round(adjusted_yield, 2),
        "confidence": round(conf_value, 2)
    }


# 🌿 Agro Impact
@app.post("/agro-impact")
def agro_impact_endpoint(data: AgroImpactRequest):
    return predict_agro_impact(data.dict())


@app.post("/agro-impact-lite")
def agro_impact_lite_endpoint(data: AgroImpactLiteRequest):

    features = build_feature_vector(
        lat=data.latitude,
        lon=data.longitude,
        crop=data.crop,
        sowing_date=data.sowing_date,
        pest_level=data.pest_level
    )

    return predict_agro_impact(features)


# 📉 Crop Risk
@app.post("/predict-risk")
def predict_risk(data: RiskInput):

    prediction = risk_model.predict([[
        data.weather_volatility,
        data.price_fluctuation,
        data.crop_sensitivity
    ]])

    return {
        "risk_level": prediction[0]
    }


# 🐄 Livestock Health
@app.post("/predict-livestock")
def predict_livestock(data: LivestockInput):

    features = np.array([[
        data.movement,
        data.feeding,
        data.resting,
        data.temperature
    ]])

    prediction = livestock_model.predict(features)
    probabilities = livestock_model.predict_proba(features)

    label = livestock_label_encoder.inverse_transform(prediction)[0]
    confidence = float(np.max(probabilities) * 100)

    action_map = {
        "Healthy": "No action required",
        "Needs Attention": "Monitor closely & check feeding behavior",
        "Critical": "Immediate veterinary consultation recommended"
    }

    return {
        "health_status": label,
        "confidence_percent": round(confidence, 2),
        "recommended_action": action_map.get(label)
    }
#model 3 - market price intelligence
#model 3 - market price intelligence
@app.post("/price-intelligence")
def price_endpoint(data: PriceRequest):

    return get_price_intelligence(
        crop=data.crop,
        mandi=data.mandi,
        zip_code=data.zip_code,
        country_code=data.country_code,
        days=data.days
    )

# New endpoint: Live market price from Agmarknet
from fastapi import Query
@app.get("/market-live")
def market_live(
    commodity: str = Query("Wheat"),
    market: str = Query("Delhi"),
    state: str = Query("Delhi"),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    df = fetch_agmarknet_data(commodity=commodity, market=market, state=state, start_date=start_date, end_date=end_date)
    if df.empty:
        raise HTTPException(status_code=404, detail="No data found from Agmarknet API")
    latest = df.sort_values("Price_Date").iloc[-1]
    return {
        "commodity": latest["Commodity"],
        "market": latest["Market"],
        "state": latest["State"],
        "modal_price": latest["Modal_Price"],
        "date": latest["Price_Date"]
    }

@app.post("/sell-recommendation")
def sell_endpoint(data: SellRequest):

    return get_sell_recommendation(
        crop=data.crop,
        mandi=data.mandi,
        zip_code=data.zip_code,
        days=data.days,
        weather_input=data.weather_input
    )


@app.get("/firebase/status")
def firebase_status():
    return {
        "configured": is_firebase_configured()
    }


@app.post("/auth/verify-firebase-token")
def verify_firebase_token(data: FirebaseTokenRequest):
    try:
        decoded_token = verify_firebase_id_token(data.id_token)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid Firebase ID token") from exc

    return {
        "uid": decoded_token.get("uid"),
        "email": decoded_token.get("email"),
        "name": decoded_token.get("name"),
        "email_verified": decoded_token.get("email_verified", False)
    }