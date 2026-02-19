import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "labeled_data.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
SPLIT_DIR = os.path.join(BASE_DIR, "data", "processed", "train_test_split")

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(SPLIT_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "agro_impact_model.pkl")
TARGET_ENCODER_PATH = os.path.join(MODEL_DIR, "target_encoder.pkl")
SOIL_ENCODER_PATH = os.path.join(MODEL_DIR, "soil_encoder.pkl")
WATER_ENCODER_PATH = os.path.join(MODEL_DIR, "water_encoder.pkl")

df = pd.read_csv(DATA_PATH)

df = df.drop(columns=["label"])

X = df.drop(columns=["impact"])
y = df["impact"]

soil_encoder = LabelEncoder()
X["soil_type"] = soil_encoder.fit_transform(X["soil_type"])

water_encoder = LabelEncoder()
X["water_source_type"] = water_encoder.fit_transform(X["water_source_type"])

stage_encoder = LabelEncoder()
X["growth_stage"] = stage_encoder.fit_transform(X["growth_stage"])

joblib.dump(soil_encoder, SOIL_ENCODER_PATH)
joblib.dump(water_encoder, WATER_ENCODER_PATH)
joblib.dump(stage_encoder, os.path.join(MODEL_DIR, "stage_encoder.pkl"))

target_encoder = LabelEncoder()
y_encoded = target_encoder.fit_transform(y)
joblib.dump(target_encoder, TARGET_ENCODER_PATH)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

X_train.to_csv(os.path.join(SPLIT_DIR, "X_train.csv"), index=False)
X_test.to_csv(os.path.join(SPLIT_DIR, "X_test.csv"), index=False)
pd.Series(y_train).to_csv(os.path.join(SPLIT_DIR, "y_train.csv"), index=False)
pd.Series(y_test).to_csv(os.path.join(SPLIT_DIR, "y_test.csv"), index=False)

model = RandomForestClassifier(
    n_estimators=400,
    max_depth=None,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

joblib.dump(model, MODEL_PATH)

print("Agro Impact Model trained successfully")
print("Model saved at:", MODEL_PATH)
