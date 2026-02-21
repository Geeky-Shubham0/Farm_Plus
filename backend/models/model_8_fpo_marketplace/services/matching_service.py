import json
import os
import sys
# Add parent directory to sys.path for absolute import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from schemas.marketplace_schemas import CompanyRequirement, MatchResult



BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

AGGREGATED_FILE = os.path.join(DATA_DIR, "aggregated_lots.json")


def load_aggregated_lots():
    if not os.path.exists(AGGREGATED_FILE):
        return []
    with open(AGGREGATED_FILE, "r") as f:
        return json.load(f)


def match_company_requirement(req: CompanyRequirement):
    lots = load_aggregated_lots()

    eligible = [
        lot for lot in lots
        if lot["crop"] == req.crop
        and lot["grade"] == req.required_grade
        and lot["total_quantity_kg"] >= req.min_quantity_kg
    ]

    if not eligible:
        return []

    # Rank by FPQI
    ranked = sorted(
        eligible,
        key=lambda x: x["average_fpqi"],
        reverse=True
    )

    results = []
    for lot in ranked:
        score = lot["average_fpqi"]

        results.append(
            MatchResult(
                company_id=req.company_id,
                matched_fpo_id=lot["fpo_id"],
                crop=lot["crop"],
                grade=lot["grade"],
                quantity_kg=lot["total_quantity_kg"],
                average_fpqi=lot["average_fpqi"],
                score=score
            )
        )

    return results