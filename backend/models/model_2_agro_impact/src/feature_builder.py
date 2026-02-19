import requests
from datetime import datetime
import statistics
import os
from dotenv import load_dotenv

load_dotenv()

AGRO_API_KEY = os.getenv("AGRO_API_KEY")


def get_weather_from_location(lat, lon):

    try:
        url = f"https://api.agromonitoring.com/agro/1.0/weather/forecast?lat={lat}&lon={lon}&appid={AGRO_API_KEY}"
        response = requests.get(url, timeout=10)
        data = response.json()

        temps = []
        humidity = []
        rainfall = []
        wind = []

        for entry in data[:8]:  # Next 24h approx
            temps.append(entry["main"]["temp"] - 273.15)
            humidity.append(entry["main"]["humidity"])
            rainfall.append(entry.get("rain", {}).get("3h", 0))
            wind.append(entry["wind"]["speed"])

        avg_temp = statistics.mean(temps)

        return {
            "temperature": avg_temp,
            "humidity": statistics.mean(humidity),
            "rainfall": sum(rainfall),
            "wind_speed": statistics.mean(wind),
            "frost_risk": 1 if avg_temp < 5 else 0
        }

    except Exception as e:
        print("Weather API failed:", e)

        return {
            "temperature": 28,
            "humidity": 60,
            "rainfall": 100,
            "wind_speed": 8,
            "frost_risk": 0
        }


def estimate_soil_properties(lat, lon, manual_input=None):

    # Priority 1: Farmer input
    if manual_input in [1, 2, 3]:
        soil_type = manual_input

    # Priority 2: Basic geo logic
    elif lat > 25:
        soil_type = 2  # Loamy
    else:
        soil_type = 3  # Clay

    # Soil-based NPK estimation
    if soil_type == 1:  # Sandy
        return {
            "soil_type": 1,
            "N": 30,
            "P": 25,
            "K": 30,
            "ph": 6.0,
            "organic_matter": 1.5
        }

    elif soil_type == 2:  # Loamy
        return {
            "soil_type": 2,
            "N": 50,
            "P": 45,
            "K": 50,
            "ph": 6.5,
            "organic_matter": 3
        }

    else:  # Clay
        return {
            "soil_type": 3,
            "N": 60,
            "P": 55,
            "K": 60,
            "ph": 7.0,
            "organic_matter": 4
        }


def calculate_growth_stage(crop, sowing_date):

    today = datetime.today()
    sowing = datetime.strptime(sowing_date, "%Y-%m-%d")
    days = (today - sowing).days

    if days < 20:
        return 1
    elif days < 50:
        return 2
    else:
        return 3

def pest_level_to_numeric(level):

    mapping = {
        "Low": 0.2,
        "Medium": 0.5,
        "High": 0.8
    }

    return mapping.get(level, 0.4)


def build_feature_vector(lat, lon, crop, sowing_date, pest_level, manual_soil=None):

    weather = get_weather_from_location(lat, lon)
    soil = estimate_soil_properties(lat, lon, manual_soil)

    return {
        "N": soil["N"],
        "P": soil["P"],
        "K": soil["K"],
        "temperature": weather["temperature"],
        "humidity": weather["humidity"],
        "ph": soil["ph"],
        "rainfall": weather["rainfall"],
        "soil_moisture": 40,
        "soil_type": soil["soil_type"],
        "sunlight_exposure": 8,
        "wind_speed": weather["wind_speed"],
        "co2_concentration": 400,
        "organic_matter": soil["organic_matter"],
        "irrigation_frequency": 3,
        "crop_density": 5,
        "pest_pressure": pest_level_to_numeric(pest_level),
        "fertilizer_usage": 100,
        "growth_stage": calculate_growth_stage(crop, sowing_date),
        "urban_area_proximity": 10,
        "water_source_type": 1,
        "frost_risk": weather["frost_risk"],
        "water_usage_efficiency": 2.5
    }
