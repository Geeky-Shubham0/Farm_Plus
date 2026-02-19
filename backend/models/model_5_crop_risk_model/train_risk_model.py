import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os

# 1️⃣ Generate Synthetic Dataset
np.random.seed(42)
data_size = 1000

weather_volatility = np.random.uniform(0, 1, data_size)
price_fluctuation = np.random.uniform(0, 30, data_size)
crop_sensitivity = np.random.randint(1, 11, data_size)

risk = []

for w, p, c in zip(weather_volatility, price_fluctuation, crop_sensitivity):
    score = (w * 0.4) + (p/30 * 0.3) + (c/10 * 0.3)

    if score < 0.4:
        risk.append("Low")
    elif score < 0.7:
        risk.append("Medium")
    else:
        risk.append("High")

df = pd.DataFrame({
    "weather_volatility": weather_volatility,
    "price_fluctuation": price_fluctuation,
    "crop_sensitivity": crop_sensitivity,
    "risk": risk
})

X = df[["weather_volatility", "price_fluctuation", "crop_sensitivity"]]
y = df["risk"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))


os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/risk_model.pkl")

print("Risk Model trained and saved successfully!")
