# Project Feasibility — MVP

A small web tool to help undergraduate students (and supervisors) quickly evaluate the feasibility of software / computer engineering project ideas.  
Backend: FastAPI (Python). Frontend: React + Vite. Rule-based evaluator for the MVP (easy to extend with LLMs later).

---

## Table of contents

- Project vision
- Features (MVP)
- Tech stack
- File structure
- Quick start (dev)
  - Backend
  - Frontend
- API spec
  - POST /api/evaluate
  - Example request / response
- Data model
- Scoring & evaluation logic (summary)
- How to extend
- Docker (optional)
- Testing examples
- License & credits

---

## Project vision

Target users
- Primary: Undergrad students (Years 2–4) choosing software / computer engineering projects
- Secondary: Lecturers / supervisors who want a quick sanity check

Core MVP flow
1. Student opens web app (no login)
2. Fills project form (title, description, degree level, course type, team size, duration, tech tags)
3. Clicks Evaluate → server runs rule-based scoring and returns:
   - Overall feasibility label
   - Difficulty breakdown (technical complexity, workload, risk)
   - Suggested tech stack and scope suggestions
   - Marks potential estimate
4. User can export/share result (future)

---

## Features (MVP)

- Project input form
- Rule-based evaluation engine (FastAPI)
- Results dashboard (radar / bar chart + textual explanation)
- Export to PDF (future / optional)
- Shareable link (future / optional)

---

## Tech stack

- Backend: FastAPI + Pydantic
- Frontend: React + Vite
- DB: none required for MVP (optionally PostgreSQL / SQLite)
- Dev server: Uvicorn (backend), Vite (frontend)
- Optional later: Postgres, Redis, Docker, LLM integration

---

## File structure

Top-level (suggested)
```
project-feasibility-app/
├─ backend/
│  ├─ app/
│  │  ├─ __init__.py
│  │  ├─ main.py             # FastAPI app + routes
│  │  ├─ schemas.py          # Pydantic request/response models
│  │  ├─ evaluator.py        # Rule-based scoring logic
│  │  └─ config.py           # Configuration & constants
│  ├─ requirements.txt
│  └─ run.sh
├─ frontend/
│  ├─ index.html
│  ├─ package.json
│  ├─ vite.config.js
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ api.js
│     ├─ styles.css
│     └─ components/
│        ├─ ProjectForm.jsx
│        └─ ResultPanel.jsx
└─ README.md   <-- this file
```

---

## Quick start (development)

Prereqs:
- Python 3.10+
- Node.js 16+ / 18+ (recommended)
- npm, yarn or pnpm

1) Clone
```bash
git clone https://github.com/<your-org>/project-feasibility.git
cd project-feasibility-app
```

2) Backend (FastAPI)

- Create & activate virtual environment
```bash
cd backend
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1
```

- Install dependencies
```bash
pip install -r requirements.txt
```

- Run dev server
```bash
# from backend/ directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will serve the evaluate endpoint at `http://localhost:8000/api/evaluate`. Open interactive docs at `http://localhost:8000/docs`.

3) Frontend (React + Vite)

- Install and run
```bash
cd ../frontend
npm install
npm run dev
```

- Open the URL printed by Vite (typically http://localhost:5173).

---

## API spec

POST /api/evaluate
- Description: Accepts a project submission JSON, runs the rule-based evaluator and returns evaluation result.

Request JSON (example schema)
```json
{
  "title": "AI-Assisted Crypto Trading Bot on Solana",
  "description": "We will build a real-time cryptocurrency trading assistant that uses Twitter + Telegram sentiment analysis, price data, and wallet flows on the Solana blockchain to automatically execute trades. The system includes web dashboard, automated trading engine, alerts, and risk management module.",
  "degree_level": "BSc",         // Enum: "Diploma","BSc","MSc","Other"
  "course_type": "FYP",          // Enum: "FYP","MiniProject","Assignment","Other"
  "team_size": 2,
  "duration_weeks": 16,          // integer (weeks)
  "tech_tags": ["ML", "Blockchain", "Web", "Real-time"]
}
```

Response JSON (conceptual)
```json
{
  "project_id": "uuid-or-generated-id",
  "difficulty_score": 8.2,
  "difficulty_label": "Very challenging",
  "feasibility_score": 6.5,
  "feasibility_label": "Feasible with high risk",
  "marks_potential": 90,
  "breakdown": {
    "technical_breadth": 8,
    "technical_depth": 9,
    "integration_complexity": 8,
    "data_complexity": 7,
    "team_time_match": 5
  },
  "recommended_tech_stack": {
    "backend": "FastAPI",
    "ml": "PyTorch / Transformers",
    "blockchain": "Solana web3",
    "frontend": "React"
  },
  "suggestions": [
    "Phase 1: build sentiment dashboard and paper-trading. Do not enable automatic live trading in Phase 1.",
    "Drop one platform (e.g., mobile) to reduce scope.",
    "Replace deep learning models with pre-trained embeddings and classical ML for MVP."
  ]
}
```

---

## Data model (MVP)

ProjectSubmission
- id: UUID
- title: string
- description: text
- degree_level: enum
- course_type: enum
- team_size: integer
- duration_weeks: integer
- tech_tags: string[]
- created_at: datetime (optional)

EvaluationResult
- project_id: UUID
- difficulty_score: float
- feasibility_score: float
- marks_potential: float
- difficulty_label: string
- feasibility_label: string
- recommended_tech_stack: JSON
- suggestions: string[]

---

## Scoring & evaluation logic (summary)

Dimensions (each 0–10):
- technical_breadth — how many different domains (web, mobile, ml, hw)
- technical_depth — advanced tech (DL, real-time, distributed)
- non_functional_requirements — real-time, low latency, HA
- integration_complexity — external APIs, hardware
- data_complexity — large datasets, streaming, cleaning required
- team_time_match — does workload match team size & duration

Example formula:
- difficulty_score = 0.35 * technical_breadth + 0.35 * technical_depth + 0.15 * integration_complexity + 0.15 * data_complexity
- feasibility_score = base_feasibility - penalties (too broad for team, too advanced for duration)
- marks_potential = difficulty_score*0.4 + novelty_score*0.3 + real_world_relevance*0.3

Simple keyword heuristics (example):
- Add depth: "deep learning", "transformer", "NLP", "computer vision" → +3 depth
- Add integration: "blockchain", "Solana", "web3" → +2 integration
- Add non-functional complexity: "real-time", "low latency", "streaming", "Kafka" → +2–3
- IoT / hardware: "raspberry pi", "microcontroller" → +2 integration

Hardcoded suggestion rules:
- If difficulty_score > 8 and team_size <= 2 and duration_weeks < 16: suggest trimming advanced components and focusing on one core innovation.
- If difficulty_score < 3: suggest adding evaluation, performance analysis, or deployment tasks.

---

## How to extend

- Persist submissions: add PostgreSQL and an ORM (SQLModel or SQLAlchemy).
- Add authentication & user accounts (students & supervisors).
- Save & share results (create GET /api/project/:id).
- Add PDF export using a headless renderer (Playwright / wkhtmltopdf) or html-to-pdf libraries on frontend.
- Replace rule-based evaluator with hybrid model: rules + LLM scoring/rewrites.
- Add supervisor mode with custom weighting per dimension.

---

## Docker (optional)

A simple Docker setup can contain two services: backend and frontend. Add Dockerfile for backend and frontend, and a docker-compose.yml to wire them together and optionally attach Postgres.

Example (concept):
- backend/Dockerfile
- frontend/Dockerfile
- docker-compose.yml

(If you want, I can generate the Dockerfiles and compose file next.)

---

## Testing examples

cURL example (POST evaluate)
```bash
curl -X POST "http://localhost:8000/api/evaluate" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"AI-Assisted Crypto Trading Bot on Solana",
    "description":"Real-time trading assistant using sentiment + price data + trading engine",
    "degree_level":"BSc",
    "course_type":"FYP",
    "team_size":2,
    "duration_weeks":16,
    "tech_tags":["ML","Blockchain","Web","Real-time"]
  }'
```

Sample response (abridged)
```json
{
  "difficulty_score": 8.2,
  "difficulty_label": "Very challenging",
  "feasibility_score": 6.5,
  "feasibility_label": "Feasible with high risk",
  "suggestions": ["Phase 1: sentiment dashboard only", "..."]
}
```

---

## Next steps I can provide (optional)

- Full backend code (FastAPI) including `schemas.py`, `evaluator.py`, `main.py` ready to run
- Frontend React + Vite skeleton with `ProjectForm` and `ResultPanel` components
- Dockerfiles and docker-compose
- Unit tests for evaluator
- UI mockups (Figma-like layout) or storybook components

Tell me which of the above you want next (I can generate code files for backend, frontend, or both). If you want everything now, say "generate full project" and specify whether you prefer SQLite (no extra setup) or Postgres.

---

## License & credits

MIT License — feel free to reuse and adapt.  
Built as an MVP design and generator for student project feasibility checks.

---

Thank you — tell me which files you want generated first (backend, frontend, or both). I can produce the full code files and folder layout next.