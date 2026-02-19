import pandas as pd
import random

data = []

# Healthy animals
for _ in range(250):
    movement = random.randint(4500, 6000)
    feeding = random.randint(2, 4)
    resting = random.randint(7, 10)
    temperature = round(random.uniform(38.2, 38.9), 1)
    data.append([movement, feeding, resting, temperature, "Healthy"])

# Needs Attention
for _ in range(200):
    movement = random.randint(2500, 4000)
    feeding = random.randint(1, 2)
    resting = random.randint(11, 15)
    temperature = round(random.uniform(39.0, 39.6), 1)
    data.append([movement, feeding, resting, temperature, "Needs Attention"])

# Critical
for _ in range(150):
    movement = random.randint(500, 2000)
    feeding = random.randint(0, 1)
    resting = random.randint(16, 22)
    temperature = round(random.uniform(40.0, 41.5), 1)
    data.append([movement, feeding, resting, temperature, "Critical"])

df = pd.DataFrame(data, columns=[
    "movement", "feeding", "resting", "temperature", "label"
])

df.to_csv("../data/livestock_data.csv", index=False)

print("Bulk dataset generated successfully")
