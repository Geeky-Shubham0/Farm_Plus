import pandas as pd

RAW = r"backend\models\model_1_crop_yield_estimation\data\raw\crop_yield.csv"
OUT = r"backend\models\model_1_crop_yield_estimation\data\processed\cleaned_data.csv"

df = pd.read_csv(RAW)
df = df.dropna().reset_index(drop=True)
df.to_csv(OUT, index=False)

print("Cleaned data saved")
