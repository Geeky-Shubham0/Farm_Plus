from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import sys
import os

# Model-1 importable
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_1_PATH = os.path.join(
    BASE_DIR,
    "models",
    "model_1_crop_yield_estimation"
)

sys.path.append(MODEL_1_PATH)

# Imports from Model-1
from backend.models.model_1_crop_yield_estimation.src.local_adjustment.apply_adjustment import apply_adjustment
from backend.models.model_1_crop_yield_estimation.src.confidence.confidence_score import confidence_score

# Load trained model
MODEL_PATH = os.path.join(
    MODEL_1_PATH,
    "models",
    "base_crop_yield_model.pkl"
)

model = joblib.load(MODEL_PATH)

app = FastAPI(
    title="Farm+ Crop Yield API",
    version="1.0"
)

# Request schema
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

# Response schema
class CropResponse(BaseModel):
    base_yield: float
    adjusted_yield: float
    confidence: float

# Helper
def predict_base_yield(input_dict):
    df = pd.DataFrame([input_dict])
    log_pred = model.predict(df)[0]
    return float(np.expm1(log_pred))

# API endpoint
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

    processed_input = model.named_steps["preprocessor"].transform(
        pd.DataFrame([input_data])
    )

    conf = confidence_score(
        model.named_steps["regressor"],
        processed_input
    )
    conf_value = float(conf[0]) if hasattr(conf, '__getitem__') else float(conf)

    return {
        "base_yield": round(base_yield, 2),
        "adjusted_yield": round(adjusted_yield, 2),
        "confidence": round(conf_value, 2)
    }

# Model-2 Agro Impact Imports
MODEL_2_PATH = os.path.join(
    BASE_DIR,
    "models",
    "model_2_agro_impact"
)

sys.path.append(MODEL_2_PATH)

from backend.models.model_2_agro_impact.src.predict_impact import predict_agro_impact
# -----------------------------
# Model-2 Request Schema
# -----------------------------
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

# -----------------------------
# Model-2 Endpoint
# -----------------------------
@app.post("/agro-impact")
def agro_impact_endpoint(data: AgroImpactRequest):

    input_data = data.dict()

    result = predict_agro_impact(input_data)

    return result


# Model-5 Crop Risk Detection Model
# Load Risk Model
RISK_MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "model_5_crop_risk_model",
    "models",
    "risk_model.pkl"
)

risk_model = joblib.load(RISK_MODEL_PATH)


class RiskInput(BaseModel):
    weather_volatility: float
    price_fluctuation: float
    crop_sensitivity: int


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

