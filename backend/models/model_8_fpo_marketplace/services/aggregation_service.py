import json
import os
import sys
from typing import List

# Add parent directory to sys.path for absolute import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from schemas.marketplace_schemas import FarmerLot, FPOAggregateLot


BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

FARMER_FILE = os.path.join(DATA_DIR, "farmer_lots.json")
AGGREGATED_FILE = os.path.join(DATA_DIR, "aggregated_lots.json")


def load_farmer_lots():
    if not os.path.exists(FARMER_FILE):
        return []
    with open(FARMER_FILE, "r") as f:
        return json.load(f)


def save_farmer_lots(lots):
    with open(FARMER_FILE, "w") as f:
        json.dump(lots, f, indent=4)


def save_aggregated_lot(lot):
    if os.path.exists(AGGREGATED_FILE):
        with open(AGGREGATED_FILE, "r") as f:
            data = json.load(f)
    else:
        data = []

    data.append(lot)

    with open(AGGREGATED_FILE, "w") as f:
        json.dump(data, f, indent=4)


def submit_farmer_lot(lot: FarmerLot):
    lots = load_farmer_lots()
    lots.append(lot.dict())
    save_farmer_lots(lots)
    return {"message": "Farmer lot stored successfully"}


def aggregate_lots(fpo_id: str, crop: str, grade: str):
    lots = load_farmer_lots()

    matching = [
        lot for lot in lots
        if lot["crop"] == crop and lot["grade"] == grade
    ]

    if not matching:
        return None

    total_qty = sum(l["quantity_kg"] for l in matching)
    avg_fpqi = sum(l["fpqi"] for l in matching) / len(matching)

    aggregate = FPOAggregateLot(
        fpo_id=fpo_id,
        crop=crop,
        total_quantity_kg=total_qty,
        average_fpqi=round(avg_fpqi, 2),
        grade=grade,
        farmer_lot_ids=[l["lot_id"] for l in matching]
    )

    save_aggregated_lot(aggregate.dict())

    return aggregate