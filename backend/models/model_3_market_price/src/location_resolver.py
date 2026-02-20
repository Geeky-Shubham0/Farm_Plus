import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")


def get_coordinates_from_zip(zip_code, country_code="IN"):

    url = "http://api.openweathermap.org/geo/1.0/zip"

    params = {
        "zip": f"{zip_code},{country_code}",
        "appid": API_KEY
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        raise ValueError("Invalid ZIP or API error")

    data = response.json()

    return data["lat"], data["lon"]
