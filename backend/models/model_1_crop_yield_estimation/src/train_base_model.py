import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import os

df = pd.read_csv(r"backend\models\model_1_crop_yield_estimation\data\processed\features_base_model.csv")
X = df[
    ["Crop","Season","State","Crop_Year","Area",
     "Annual_Rainfall","fertilizer_per_area","pesticide_per_area"]
]
y = df["log_yield"]

prep = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"),
     ["Crop","Season","State"]),
    ("num", "passthrough",
     ["Crop_Year","Area","Annual_Rainfall",
      "fertilizer_per_area","pesticide_per_area"])
])

model = Pipeline([
    ("prep", prep),
    ("rf", RandomForestRegressor(n_estimators=300, random_state=42))
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model.fit(X_train, y_train)

model_dir = r"backend\models\model_1_crop_yield_estimation\models"
train_test_dir = r"backend\models\model_1_crop_yield_estimation\data\processed\train_test_split"
os.makedirs(model_dir, exist_ok=True)
os.makedirs(train_test_dir, exist_ok=True)

joblib.dump(model, os.path.join(model_dir, "base_crop_yield_model.pkl"))
X_train.to_csv(os.path.join(train_test_dir, "train.csv"), index=False)
X_test.to_csv(os.path.join(train_test_dir, "test.csv"), index=False)

print("Model trained")

import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import os

DATA_PATH = r"backend\models\model_1_crop_yield_estimation\data\processed\features_base_model.csv"
MODEL_PATH = r"backend\models\model_1_crop_yield_estimation\models\base_crop_yield_model.pkl"
SPLIT_PATH = r"backend\models\model_1_crop_yield_estimation\data\processed\train_test_split"

df = pd.read_csv(DATA_PATH)


features = [
    "Crop",
    "Season",
    "State",
    "Crop_Year",
    "Area",
    "Production",               
    "Annual_Rainfall",
    "fertilizer_per_area",
    "pesticide_per_area"
]

X = df[features]
y = df["log_yield"]

categorical_features = ["Crop", "Season", "State"]
numeric_features = [
    "Crop_Year",
    "Area",
    "Production",
    "Annual_Rainfall",
    "fertilizer_per_area",
    "pesticide_per_area"
]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features)
    ]
)


model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(
        n_estimators=400,
        max_depth=None,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    ))
])

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model.fit(X_train, y_train)
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
os.makedirs(SPLIT_PATH, exist_ok=True)

joblib.dump(model, MODEL_PATH)

X_train.to_csv(SPLIT_PATH + "X_train.csv", index=False)
X_test.to_csv(SPLIT_PATH + "X_test.csv", index=False)
y_train.to_csv(SPLIT_PATH + "y_train.csv", index=False)
y_test.to_csv(SPLIT_PATH + "y_test.csv", index=False)

print("Base crop yield model trained successfully")
print("Saved:")
print(" - models/base_crop_yield_model.pkl")
print(" - data/processed/train_test_split/X_train.csv")
print(" - data/processed/train_test_split/X_test.csv")
print(" - data/processed/train_test_split/y_train.csv")
print(" - data/processed/train_test_split/y_test.csv")
