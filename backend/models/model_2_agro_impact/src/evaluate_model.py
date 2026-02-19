import pandas as pd
import joblib
import os

from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "agro_impact_model.pkl")
TARGET_ENCODER_PATH = os.path.join(BASE_DIR, "models", "target_encoder.pkl")

X_TEST_PATH = os.path.join(BASE_DIR, "data", "processed", "train_test_split", "X_test.csv")
Y_TEST_PATH = os.path.join(BASE_DIR, "data", "processed", "train_test_split", "y_test.csv")

model = joblib.load(MODEL_PATH)
target_encoder = joblib.load(TARGET_ENCODER_PATH)

X_test = pd.read_csv(X_TEST_PATH)
y_test = pd.read_csv(Y_TEST_PATH).values.ravel()

preds = model.predict(X_test)

accuracy = accuracy_score(y_test, preds)

print("\nAccuracy:", round(accuracy, 4))

print("\nClassification Report:\n")

print(
    classification_report(
        y_test,
        preds,
        target_names=target_encoder.classes_
    )
)

print("Confusion Matrix:\n")
print(confusion_matrix(y_test, preds))
