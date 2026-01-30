import joblib
import pandas as pd
from sklearn.metrics import r2_score, mean_absolute_error


model = joblib.load("backend/models/model_1_crop_yield_estimation/models/base_crop_yield_model.pkl")

X_test = pd.read_csv("backend/models/model_1_crop_yield_estimation/data/processed/train_test_split/train_test_splitX_test.csv")
y_test = pd.read_csv("backend/models/model_1_crop_yield_estimation/data/processed/train_test_split/train_test_splity_test.csv")

preds = model.predict(X_test)

print("R2 Score:", r2_score(y_test, preds))
print("MAE:", mean_absolute_error(y_test, preds))
