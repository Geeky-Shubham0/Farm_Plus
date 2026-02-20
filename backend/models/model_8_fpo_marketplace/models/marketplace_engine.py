from ..services.aggregation_service import submit_farmer_lot, aggregate_lots
from ..services.matching_service import match_company_requirement


class MarketplaceEngine:

    def submit_lot(self, lot):
        return submit_farmer_lot(lot)

    def aggregate(self, fpo_id, crop, grade):
        return aggregate_lots(fpo_id, crop, grade)

    def match(self, requirement):
        return match_company_requirement(requirement)