def evaluate_weather_risk(weather_output):

    impact = weather_output.get("impact")

    if impact == "Negative":
        return "high_risk"
    elif impact == "Neutral":
        return "moderate_risk"
    else:
        return "low_risk"