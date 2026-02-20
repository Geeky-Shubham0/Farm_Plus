def calculate_distance_penalty(distance_km: float) -> float:
    """
    ₹2 per km logistics penalty
    """
    return distance_km * 2