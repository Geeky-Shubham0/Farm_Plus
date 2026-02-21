from backend.models.model_9_dynamic_pricing.services.distance_service import calculate_distance_penalty


class PricingEngine:

    def calculate_price(
        self,
        fpqi: float,
        base_market_price: float,
        farmer_trust_score: float,
        distance_km: float
    ):
        # Quality bonus
        quality_bonus_percent = max(0, (fpqi - 75)) * 0.02
        quality_bonus = base_market_price * quality_bonus_percent

        # Trust bonus
        trust_bonus = base_market_price * (farmer_trust_score * 0.01)

        # Distance penalty
        distance_penalty = calculate_distance_penalty(distance_km)

        final_price = (
            base_market_price
            + quality_bonus
            + trust_bonus
            - distance_penalty
        )

        return {
            "final_price": round(final_price, 2),
            "quality_bonus": round(quality_bonus, 2),
            "trust_bonus": round(trust_bonus, 2),
            "distance_penalty": round(distance_penalty, 2)
        }