def fetch_varietywise_prices(commodity=None, variety=None, market=None, state=None, start_date=None, end_date=None):
    """
    Fetches variety-wise daily market price data from Data.gov.in API.
    Params:
        commodity (str): Name of the commodity/crop (e.g., 'Wheat')
        variety (str): Variety name (e.g., 'PBW343')
        market (str): Name of the mandi/market (e.g., 'Delhi')
        state (str): State name (e.g., 'Delhi')
        start_date (str): Start date in 'yyyy-mm-dd' format
        end_date (str): End date in 'yyyy-mm-dd' format
    Returns:
        pd.DataFrame: DataFrame with columns ['Commodity', 'Variety', 'Market', 'State', 'Modal_Price', 'Price_Date']
    """
    url = os.getenv("VARIETYWISE_API_URL", "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24")
    apikey = os.getenv("VARIETYWISE_API_KEY")
    if not apikey:
        raise Exception("VARIETYWISE_API_KEY not set in environment variables.")

    api_format = os.getenv("VARIETYWISE_API_FORMAT", "json")
    params = {
        "api-key": apikey,
        "format": api_format,
        "limit": 100,
    }
    if filter_str:
        params["filters[]"] = filter_str

    filters = []
    if commodity:
        filters.append(f"commodity:{commodity}")
    if variety:
        filters.append(f"variety:{variety}")
    if market:
        filters.append(f"market:{market}")
    if state:
        filters.append(f"state:{state}")
    filter_str = "|".join(filters) if filters else None

    session = requests.Session()
    retries = Retry(total=3, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504], allowed_methods=["GET"])
    adapter = HTTPAdapter(max_retries=retries)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    try:
        response = session.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Varietywise API connection error: {e}")

    return pd.DataFrame(data.get("records", []))
    if start_date:
        df = df[df["Price_Date"] >= start_date]
    if end_date:
        df = df[df["Price_Date"] <= end_date]
    return df.reset_index(drop=True)

import requests
import pandas as pd
from datetime import datetime
import os
from dotenv import load_dotenv
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

load_dotenv()

def fetch_agmarknet_data(commodity=None, market=None, state=None, start_date=None, end_date=None):
    """
    Fetches daily market price data from Agmarknet API (Govt. of India).
    Params:
        commodity (str): Name of the commodity/crop (e.g., 'Wheat')
        market (str): Name of the mandi/market (e.g., 'Delhi')
        state (str): State name (e.g., 'Delhi')
        start_date (str): Start date in 'dd-mm-yyyy' format
        end_date (str): End date in 'dd-mm-yyyy' format
    Returns:
        pd.DataFrame: DataFrame with columns ['Commodity', 'Market', 'State', 'Modal_Price', 'Price_Date']
    """
    # Use environment variable for API key and URL
    url = os.getenv("AGMARKNET_API_URL", "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070")
    apikey = os.getenv("AGMARKNET_API_KEY")
    if not apikey:
        raise Exception("AGMARKNET_API_KEY not set in environment variables.")
    params = {
        "api-key": apikey,
        "format": "json",
        "limit": 100,
    }
    if commodity:
        params["filters[Commodity]"] = commodity
    if market:
        params["filters[Market]"] = market
    if state:
        params["filters[State]"] = state
    session = requests.Session()
    retries = Retry(total=3, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504], allowed_methods=["GET"])
    adapter = HTTPAdapter(max_retries=retries)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    try:
        response = session.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Agmarknet API connection error: {e}")
    records = []
    for item in data.get("records", []):
        try:
            modal_price = float(item.get("modal_price", 0))
        except Exception:
            modal_price = 0
        records.append({
            "Commodity": item.get("commodity"),
            "Market": item.get("market"),
            "State": item.get("state"),
            "Modal_Price": modal_price,
            "Price_Date": item.get("arrival_date"),
        })
    df = pd.DataFrame(records)
    if start_date:
        df = df[df["Price_Date"] >= start_date]
    if end_date:
        df = df[df["Price_Date"] <= end_date]
    return df.reset_index(drop=True)
