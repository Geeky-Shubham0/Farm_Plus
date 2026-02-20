from pydantic import BaseModel

class PricingRequest(BaseModel):
    crop: str
    fpqi: float
    base_market_price: float
    farmer_trust_score: float = 0.5
    distance_km: float = 0


class PricingResponse(BaseModel):
    final_price: float
    quality_bonus: float
    trust_bonus: float
    distance_penalty: float