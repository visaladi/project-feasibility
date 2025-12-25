from typing import List, Literal, Optional
from pydantic import BaseModel, Field


DegreeLevel = Literal["Diploma", "BSc", "MSc", "Other"]
CourseType = Literal["FYP", "MiniProject", "Assignment", "Other"]


class ProjectInput(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=5000)
    degree_level: DegreeLevel
    course_type: CourseType
    team_size: int = Field(..., ge=1, le=10)
    duration_weeks: int = Field(..., ge=1, le=52)
    tech_tags: List[str] = []


class RecommendedTechStack(BaseModel):
    frontend: List[str]
    backend: List[str]
    database: List[str]
    ml_stack: Optional[List[str]] = None
    blockchain: Optional[List[str]] = None
    devops: Optional[List[str]] = None


class EvaluationResult(BaseModel):
    difficulty_score: float
    feasibility_score: float
    marks_potential: float
    difficulty_label: str
    feasibility_label: str
    novel_idea_score: float
    recommended_tech_stack: RecommendedTechStack
    suggestions: List[str]
    raw_dimension_scores: dict
