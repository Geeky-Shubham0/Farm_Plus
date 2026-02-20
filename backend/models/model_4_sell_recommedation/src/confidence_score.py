def calculate_confidence(momentum_score,
                         volatility_risk,
                         weather_risk):

    base_confidence = momentum_score

    if volatility_risk == "high":
        base_confidence -= 20
    elif volatility_risk == "moderate":
        base_confidence -= 10

    if weather_risk == "high_risk":
        base_confidence -= 20
    elif weather_risk == "moderate_risk":
        base_confidence -= 10

    return max(min(round(base_confidence, 2), 100), 0)