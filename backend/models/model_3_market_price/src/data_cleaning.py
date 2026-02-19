import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RAW_PATH = os.path.join(BASE_DIR, "data", "raw", "mandi_prices.csv")
PROCESSED_PATH = os.path.join(BASE_DIR, "data", "processed", "cleaned_data.csv")

def clean_all_data():

    df = pd.read_csv(RAW_PATH)

    df = df[["Commodity", "Market Name", "Price Date", "Modal_Price"]]

    df["Price Date"] = pd.to_datetime(df["Price Date"])
    df.sort_values(["Commodity", "Market Name", "Price Date"], inplace=True)

    os.makedirs(os.path.dirname(PROCESSED_PATH), exist_ok=True)
    df.to_csv(PROCESSED_PATH, index=False)

    print("Full dataset cleaned and saved")


if __name__ == "__main__":
    clean_all_data()
