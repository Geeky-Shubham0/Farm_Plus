import joblib
import pandas as pd
import os


BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
CLEAN_PATH = os.path.join(BASE_DIR, "data", "processed", "cleaned_data.csv")


def predict_next_days(crop: str, mandi: str, days: int = 7):
    """
    Predict next N days price for given crop and mandi.
    Uses recursive forecasting based on last 3 lag values.
    """

    # -----------------------------
    # Load model
    # -----------------------------
    model_name = f"{crop}_{mandi}.pkl"
    model_name = model_name.replace(" ", "_").replace("/", "_")

    model_path = os.path.join(MODEL_DIR, model_name)

    if not os.path.exists(model_path):
        raise ValueError(f"Model not found for: {crop} - {mandi}")

    model = joblib.load(model_path)

    # -----------------------------
    # Load historical data
    # -----------------------------
    df = pd.read_csv(CLEAN_PATH)

    df = df[
        (df["Commodity"].str.lower() == crop.lower()) &
        (df["Market Name"].str.lower() == mandi.lower())
    ]

    df = df.sort_values("Price Date")

    if len(df) < 3:
        raise ValueError("Not enough historical data (minimum 3 days required).")

    predictions = []
    temp_df = df.copy()

    # -----------------------------
    # Recursive forecasting loop
    # -----------------------------
    for _ in range(days):

        last3 = temp_df.tail(3)

        lag_1 = last3.iloc[-1]["Modal_Price"]
        lag_2 = last3.iloc[-2]["Modal_Price"]
        lag_3 = last3.iloc[-3]["Modal_Price"]

        last_date = pd.to_datetime(last3.iloc[-1]["Price Date"])
        next_date = last_date + pd.Timedelta(days=1)

        month = next_date.month
        day_of_week = next_date.dayofweek

        X = [[lag_1, lag_2, lag_3, month, day_of_week]]

        next_price = float(model.predict(X)[0])

        predictions.append({
            "date": str(next_date.date()),
            "predicted_price": round(next_price, 2)
        })

        # Append predicted value for recursive next step
        new_row = {
            "Commodity": crop,
            "Market Name": mandi,
            "Price Date": next_date,
            "Modal_Price": next_price
        }

        temp_df = pd.concat([temp_df, pd.DataFrame([new_row])],
                            ignore_index=True)

    return predictions


# Optional testing block (safe)
if __name__ == "__main__":
    result = predict_next_days("Rice", "Guwahati", 7)
    print(result)