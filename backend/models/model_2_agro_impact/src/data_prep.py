import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

RAW_PATH = os.path.join(BASE_DIR, "data", "raw", "agro_dataset.csv")
PROCESSED_PATH = os.path.join(BASE_DIR, "data", "processed", "cleaned_data.csv")

os.makedirs(os.path.dirname(PROCESSED_PATH), exist_ok=True)

df = pd.read_csv(RAW_PATH)

df = df.dropna().reset_index(drop=True)

df.to_csv(PROCESSED_PATH, index=False)

print("Agro dataset cleaned")
