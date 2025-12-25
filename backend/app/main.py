from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import ProjectInput, EvaluationResult
from .evaluator import evaluate_project
from .config import BACKEND_NAME, VERSION

app = FastAPI(
    title=BACKEND_NAME,
    version=VERSION,
    description="API for evaluating software project complexity and feasibility.",
)

# CORS (adjust origins as needed, for dev we allow all)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for production: set specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "version": VERSION}


@app.post("/evaluate", response_model=EvaluationResult)
def evaluate_endpoint(project: ProjectInput):
    """
    Evaluate the complexity and feasibility of a project proposal.
    """
    return evaluate_project(project)
