SOIL_FACTOR = {
    "sandy": 0.90,
    "loam": 1.00,
    "clay_loam": 1.05,
    "clay": 1.02
}

def get_soil_factor(soil_type):
    return SOIL_FACTOR.get(soil_type.lower(), 1.0)
