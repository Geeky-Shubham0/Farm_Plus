import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "agro_impact_model.pkl")
TARGET_ENCODER_PATH = os.path.join(BASE_DIR, "models", "target_encoder.pkl")
SOIL_ENCODER_PATH = os.path.join(BASE_DIR, "models", "soil_encoder.pkl")
WATER_ENCODER_PATH = os.path.join(BASE_DIR, "models", "water_encoder.pkl")
STAGE_ENCODER_PATH = os.path.join(BASE_DIR, "models", "stage_encoder.pkl")

model = joblib.load(MODEL_PATH)
target_encoder = joblib.load(TARGET_ENCODER_PATH)
soil_encoder = joblib.load(SOIL_ENCODER_PATH)
water_encoder = joblib.load(WATER_ENCODER_PATH)
stage_encoder = joblib.load(STAGE_ENCODER_PATH)

def predict_agro_impact(input_data: dict):
    """
    input_data must contain all feature columns except 'label' and 'impact'
    """

    df = pd.DataFrame([input_data])

    df["soil_type"] = soil_encoder.transform(df["soil_type"])
    df["water_source_type"] = water_encoder.transform(df["water_source_type"])
    df["growth_stage"] = stage_encoder.transform(df["growth_stage"])

    pred_class = model.predict(df)[0]
    probabilities = model.predict_proba(df)[0]
    confidence = max(probabilities)

    impact_label = target_encoder.inverse_transform([pred_class])[0]

    return {
        "impact": impact_label,
        "confidence": round(float(confidence), 2)
    }