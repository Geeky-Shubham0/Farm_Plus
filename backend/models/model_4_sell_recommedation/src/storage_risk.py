def evaluate_storage_risk(crop, days_wait):

    perishable_crops = ["onion", "tomato", "potato"]

    if crop.lower() in perishable_crops:

        if days_wait > 7:
            return "high"
        elif days_wait > 3:
            return "moderate"
        else:
            return "low"

    # Non-perishable crops
    return "low"