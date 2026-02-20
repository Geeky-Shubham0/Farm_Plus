import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
EXPORT_PATH = os.path.join(BASE_DIR, "data", "export", "export_prices.csv")


def usd_to_inr(amount):
    return amount * 83


def analyze_export(crop, predicted_price):

    df = pd.read_csv(EXPORT_PATH)
    df = df[df["crop"].str.lower() == crop.lower()]

    best_country = None
    best_profit = float("-inf")
    options = []

    for _, row in df.iterrows():
        usd_price = float(row["usd_price_per_ton"])
        inr_price = usd_to_inr(usd_price)
        net_price = inr_price * 0.9

        profit = net_price - predicted_price

        options.append({
            "country": row["country"],
            "net_export_price": round(net_price, 2),
            "profit_margin": round(profit, 2)
        })

        if profit > best_profit:
            best_profit = profit
            best_country = row["country"]

    return {
        "best_country": best_country,
        "best_profit": round(best_profit, 2),
        "all_options": options
    }
