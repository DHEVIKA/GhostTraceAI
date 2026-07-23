from pydantic import BaseModel
from typing import List


class InvestigationCase(BaseModel):
    case_id: str
    user_query: str
    status: str
    root_cause: str
    confidence: float
    recommendations: List[str]