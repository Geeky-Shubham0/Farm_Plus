import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

CLEAN_PATH = os.path.join(BASE_DIR, "data", "processed", "cleaned_data.csv")
LABELED_PATH = os.path.join(BASE_DIR, "data", "processed", "labeled_data.csv")

os.makedirs(os.path.dirname(LABELED_PATH), exist_ok=True)

df = pd.read_csv(CLEAN_PATH)

temp_p = df['temperature'].quantile([0.25, 0.5, 0.75])
rain_p = df['rainfall'].quantile([0.25, 0.5, 0.75])
humidity_p = df['humidity'].quantile([0.25, 0.5, 0.75])
pest_p = df['pest_pressure'].quantile([0.25, 0.5, 0.75])
frost_p = df['frost_risk'].quantile([0.25, 0.5, 0.75])
soil_p = df['soil_moisture'].quantile([0.25, 0.5, 0.75])

def assign_impact(row):

    score = 0

    if row["temperature"] >= temp_p[0.5]:
        score += 1
    if row["rainfall"] >= rain_p[0.5]:
        score += 1
    if row["humidity"] >= humidity_p[0.5]:
        score += 1
    if row["soil_moisture"] >= soil_p[0.5]:
        score += 1
    if row["pest_pressure"] <= pest_p[0.5]:
        score += 1
    if row["frost_risk"] <= frost_p[0.5]:
        score += 1

    if row["temperature"] <= temp_p[0.25]:
        score -= 1
    if row["rainfall"] <= rain_p[0.25]:
        score -= 1
    if row["humidity"] <= humidity_p[0.25]:
        score -= 1
    if row["soil_moisture"] <= soil_p[0.25]:
        score -= 1
    if row["pest_pressure"] >= pest_p[0.75]:
        score -= 1
    if row["frost_risk"] >= frost_p[0.75]:
        score -= 1

    # Decision boundaries
    if score >= 3:
        return "Positive"
    elif score <= -1:
        return "Negative"
    else:
        return "Neutral"


df["impact"] = df.apply(assign_impact, axis=1)

df.to_csv(LABELED_PATH, index=False)

print("Impact labels created successfully")
print(df["impact"].value_counts(normalize=True))
