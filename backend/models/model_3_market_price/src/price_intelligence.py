from .predict import predict_next_days
from .export.export_decision import analyze_export
from .location_resolver import get_coordinates_from_zip
from .mandi_selector import get_nearest_mandi


def get_price_intelligence(crop,
                           mandi=None,
                           zip_code=None,
                           country_code="IN",
                           days=7):

    if mandi is None and zip_code is not None:

        lat, lon = get_coordinates_from_zip(zip_code, country_code)
        mandi = get_nearest_mandi(lat, lon)

    if mandi is None:
        raise ValueError("Either mandi or zip_code must be provided")

    forecast = predict_next_days(crop, mandi, days)

    latest_price = forecast[-1]["predicted_price"]

    export_info = analyze_export(crop, latest_price)

    return {
        "selected_mandi": mandi,
        "forecast": forecast,
        "export_analysis": export_info
    }
