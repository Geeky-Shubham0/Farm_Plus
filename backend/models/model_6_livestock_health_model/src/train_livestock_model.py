import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

data = pd.read_csv("../data/livestock_data.csv")

X = data[["movement", "feeding", "resting", "temperature"]]
y = data["label"]

le = LabelEncoder()
y_encoded = le.fit_transform(y)

model = RandomForestClassifier()
model.fit(X, y_encoded)

y_pred = model.predict(X)
accuracy = accuracy_score(y_encoded, y_pred)

print("Training Accuracy:", round(accuracy, 4))

joblib.dump(model, "../models/livestock_health_model.pkl")
joblib.dump(le, "../models/label_encoder.pkl")

print("Livestock Health Model trained and saved successfully ")
