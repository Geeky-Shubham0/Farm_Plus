import pandas as pd
import numpy as np

INP = r"backend\models\model_1_crop_yield_estimation\data\processed\cleaned_data.csv"
OUT = r"backend\models\model_1_crop_yield_estimation\data\processed\features_base_model.csv"

df = pd.read_csv(INP)

df["fertilizer_per_area"] = df["Fertilizer"] / df["Area"]
df["pesticide_per_area"] = df["Pesticide"] / df["Area"]
df["log_yield"] = np.log1p(df["Yield"])

df.to_csv(OUT, index=False)
print("Features created")
