def decide_sell_action(trend_info,
                       volatility_info,
                       weather_risk,
                       storage_risk,
                       export_info):

    trend = trend_info["trend"]
    momentum = trend_info["momentum_score"]
    export_profit = export_info.get("best_profit", 0)

    if trend == "increasing" and \
       weather_risk == "low_risk" and \
       volatility_info["volatility_risk"] == "low" and \
       storage_risk == "low":

        return "WAIT 3-5 DAYS"

    if trend == "decreasing" or weather_risk == "high_risk":
        return "SELL NOW"

    if export_profit > 5000:
        return "SELL FOR EXPORT"

    if volatility_info["volatility_risk"] == "high":
        return "SELL PARTIALLY"

    return "SELL NOW"