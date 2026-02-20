from pydantic import BaseModel
from typing import List


class FarmerLot(BaseModel):
    farmer_id: str
    lot_id: str
    crop: str
    quantity_kg: float
    fpqi: float
    grade: str


class FPOAggregateLot(BaseModel):
    fpo_id: str
    crop: str
    total_quantity_kg: float
    average_fpqi: float
    grade: str
    farmer_lot_ids: List[str]


class CompanyRequirement(BaseModel):
    company_id: str
    crop: str
    required_grade: str
    min_quantity_kg: float
    preferred_state: str | None = None


class MatchResult(BaseModel):
    company_id: str
    matched_fpo_id: str
    crop: str
    grade: str
    quantity_kg: float
    average_fpqi: float
    score: float