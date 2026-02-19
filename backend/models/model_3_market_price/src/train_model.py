from sklearn.ensemble import RandomForestRegressor
import pandas as pd
import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CLEAN_PATH = os.path.join(BASE_DIR, "data", "processed", "cleaned_data.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

def train_all_models():

    df = pd.read_csv(CLEAN_PATH)

    os.makedirs(MODEL_DIR, exist_ok=True)

    grouped = df.groupby(["Commodity", "Market Name"])

    total_models = 0

    for (crop, mandi), group in grouped:

        group = group.sort_values("Price Date")

        # Skip small datasets
        if len(group) < 60:
            continue

        group["lag_1"] = group["Modal_Price"].shift(1)
        group["lag_2"] = group["Modal_Price"].shift(2)
        group["lag_3"] = group["Modal_Price"].shift(3)

        group["month"] = pd.to_datetime(group["Price Date"]).dt.month
        group["day_of_week"] = pd.to_datetime(group["Price Date"]).dt.dayofweek

        group.dropna(inplace=True)

        X = group[["lag_1", "lag_2", "lag_3", "month", "day_of_week"]]
        y = group["Modal_Price"]

        model = RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            n_jobs=-1
        )

        model.fit(X, y)

        model_name = f"{crop}_{mandi}.pkl"
        model_name = model_name.replace(" ", "_").replace("/", "_")

        joblib.dump(model, os.path.join(MODEL_DIR, model_name))

        total_models += 1
        print(f" Trained: {crop} - {mandi}")

    print(f"\n Total models trained: {total_models}")


if __name__ == "__main__":
    train_all_models()
