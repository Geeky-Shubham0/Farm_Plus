from backend.models.model_3_market_price.src.price_intelligence import get_price_intelligence
from backend.models.model_2_agro_impact.src.predict_impact import predict_agro_impact

from backend.models.model_4_sell_recommedation.src.trend_analysis import analyze_price_trend
from backend.models.model_4_sell_recommedation.src.volatility_analysis import analyze_volatility
from backend.models.model_4_sell_recommedation.src.storage_risk import evaluate_storage_risk
from backend.models.model_4_sell_recommedation.src.confidence_score import calculate_confidence
from backend.models.model_4_sell_recommedation.src.sell_decision_engine import decide_sell_action


def get_sell_recommendation(crop,
                            mandi=None,
                            zip_code=None,
                            days=7,
                            weather_input=None):

    price_data = get_price_intelligence(
        crop=crop,
        mandi=mandi,
        zip_code=zip_code,
        days=days
    )

    forecast = price_data["forecast"]
    export_info = price_data["export_analysis"]

    trend_info = analyze_price_trend(forecast)

    volatility_info = analyze_volatility(forecast)

    weather_output = predict_agro_impact(weather_input)
    weather_risk = weather_output["impact"]

    storage_risk = evaluate_storage_risk(crop, days)

    decision = decide_sell_action(trend_info,
                                  volatility_info,
                                  weather_risk,
                                  storage_risk,
                                  export_info)

    # Step 7: Confidence
    confidence = calculate_confidence(
        trend_info["momentum_score"],
        volatility_info["volatility_risk"],
        weather_risk
    )

    return {
        "selected_mandi": price_data["selected_mandi"],
        "trend_analysis": trend_info,
        "volatility_analysis": volatility_info,
        "weather_risk": weather_risk,
        "storage_risk": storage_risk,
        "export_analysis": export_info,
        "final_recommendation": decision,
        "confidence_score": confidence
    }