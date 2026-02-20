import numpy as np

def analyze_volatility(forecast):

    prices = [day["predicted_price"] for day in forecast]

    volatility = np.std(prices)

    if volatility > 200:
        risk = "high"
    elif volatility > 100:
        risk = "moderate"
    else:
        risk = "low"

    return {
        "volatility_value": round(float(volatility), 2),
        "volatility_risk": risk
    }