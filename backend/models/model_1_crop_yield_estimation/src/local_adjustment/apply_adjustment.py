from .soil_factor import get_soil_factor
from .weather_factor import weather_factor

def apply_adjustment(base_yield, soil_type, rainfall_deviation):
    return round(
        base_yield *
        get_soil_factor(soil_type) *
        weather_factor(rainfall_deviation),
        2
    )
