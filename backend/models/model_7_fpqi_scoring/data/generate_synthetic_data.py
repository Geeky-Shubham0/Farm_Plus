import pandas as pd
import random

def generate_data(n=2000):
    data = []

    for _ in range(n):
        moisture = random.randint(40, 100)
        soil = random.randint(40, 100)
        heat = random.randint(40, 100)
        freshness = random.randint(40, 100)
        storage = random.randint(40, 100)

        fpqi = (
            0.35 * moisture +
            0.20 * soil +
            0.15 * heat +
            0.15 * freshness +
            0.15 * storage
        )

        data.append([
            moisture,
            soil,
            heat,
            freshness,
            storage,
            round(fpqi, 2)
        ])

    df = pd.DataFrame(data, columns=[
        "moisture_score",
        "soil_score",
        "heat_index",
        "freshness_score",
        "storage_risk_score",
        "fpqi"
    ])

    df.to_csv("fpqi_dataset.csv", index=False)
    print("Dataset generated successfully!")

if __name__ == "__main__":
    generate_data()