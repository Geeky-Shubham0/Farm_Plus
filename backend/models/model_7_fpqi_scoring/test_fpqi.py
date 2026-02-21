from models.fpqi_model import FPQIModel

# Correct dataset path (relative to this folder)
dataset_path = "backend/models/model_7_fpqi_scoring/data/fpqi_dataset.csv"

# Initialize model
model = FPQIModel()

# Train model
model.train(dataset_path)


# Save trained model to correct directory
import os
os.makedirs("models", exist_ok=True)

model_path = "models/fpqi_trained_model.pkl"
model.save_model(model_path)

print("Model trained and saved successfully!")

# Load model
model.load_model(model_path)

# Example prediction
features = {
    "moisture_score": 82,
    "soil_score": 75,
    "heat_index": 70,
    "freshness_score": 85,
    "storage_risk_score": 60
}

prediction = model.predict(features)
grade = model.classify_grade(prediction)

print("Predicted FPQI:", prediction)
print("Grade:", grade)