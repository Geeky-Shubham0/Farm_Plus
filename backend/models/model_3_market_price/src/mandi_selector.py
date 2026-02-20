import pandas as pd
import os
import math

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
COORD_PATH = os.path.join(BASE_DIR, "data", "raw", "mandi_coordinates.csv")


def haversine(lat1, lon1, lat2, lon2):

    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (math.sin(dlat/2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlon/2) ** 2)

    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1-a))


def get_nearest_mandi(user_lat, user_lon):

    df = pd.read_csv(COORD_PATH)

    nearest = None
    min_dist = float("inf")

    for _, row in df.iterrows():

        dist = haversine(user_lat, user_lon,
                         row["Latitude"], row["Longitude"])

        if dist < min_dist:
            min_dist = dist
            nearest = row["Market Name"]

    return nearest
