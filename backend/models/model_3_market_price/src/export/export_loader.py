import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
EXPORT_PATH = os.path.join(BASE_DIR, "data", "export", "export_prices.csv")

def load_export_data(crop):
    df = pd.read_csv(EXPORT_PATH)
    return df[df["crop"].str.lower() == crop.lower()]
