from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import sys
import os

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

from backend.models.model_1_crop_yield_estimation.src.local_adjustment.apply_adjustment import apply_adjustment
from backend.models.model_1_crop_yield_estimation.src.confidence.confidence_score import confidence_score

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

from backend.models.model_2_agro_impact.src.predict_impact import predict_agro_impact
from backend.models.model_2_agro_impact.src.feature_builder import build_feature_vector

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
app = FastAPI(
    title="Farm+ AI API",
    version="1.0"
)

# ================================
# REQUEST SCHEMAS
# ================================

class CropRequest(BaseModel):
    Crop: str
    Season: str
    State: str
    Crop_Year: int
    Area: float
    Production: float
    Annual_Rainfall: float
    fertilizer_per_area: float
    pesticide_per_area: float
    soil_type: str
    rainfall_deviation: float


class CropResponse(BaseModel):
    base_yield: float
    adjusted_yield: float
    confidence: float


class AgroImpactRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    soil_moisture: float
    soil_type: int
    sunlight_exposure: float
    wind_speed: float
    co2_concentration: float
    organic_matter: float
    irrigation_frequency: float
    crop_density: float
    pest_pressure: float
    fertilizer_usage: float
    growth_stage: int
    urban_area_proximity: float
    water_source_type: int
    frost_risk: float
    water_usage_efficiency: float


class AgroImpactLiteRequest(BaseModel):
    latitude: float
    longitude: float
    crop: str
    sowing_date: str
    pest_level: str


class RiskInput(BaseModel):
    weather_volatility: float
    price_fluctuation: float
    crop_sensitivity: int


class LivestockInput(BaseModel):
    movement: float
    feeding: int
    resting: float
    temperature: float


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
