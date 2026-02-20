import numpy as np

def analyze_price_trend(forecast):

    prices = [day["predicted_price"] for day in forecast]

    first = prices[0]
    last = prices[-1]

    change_percent = ((last - first) / first) * 100

    # Momentum score (0–100)
    momentum_score = min(max((change_percent + 10) * 5, 0), 100)

    if change_percent > 3:
        trend = "increasing"
    elif change_percent < -3:
        trend = "decreasing"
    else:
        trend = "stable"

    return {
        "trend": trend,
        "change_percent": round(change_percent, 2),
        "momentum_score": round(momentum_score, 2)
    }