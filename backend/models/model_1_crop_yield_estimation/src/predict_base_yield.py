import joblib
import pandas as pd
import numpy as np

MODEL_PATH = "C:\\Users\\sk280\\GitHub\\Farm_Plus\\backend\\models\\model_1_crop_yield_estimation\\models\\base_crop_yield_model.pkl"
model = joblib.load(MODEL_PATH)

def predict_base_yield(input_data: dict):
    df = pd.DataFrame([input_data])
    log_pred = model.predict(df)[0]
    return round(np.expm1(log_pred), 2)

sample_input = {
    "Crop": "Rice",
    "Season": "Kharif",
    "State": "Assam",
    "Crop_Year": 2024,
    "Area": 100000,
    "Production": 90000,          
    "Annual_Rainfall": 1800,
    "fertilizer_per_area": 80,
    "pesticide_per_area": 2
}

print(predict_base_yield(sample_input))


