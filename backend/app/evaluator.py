from typing import List
from .schemas import ProjectInput, EvaluationResult, RecommendedTechStack


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _keyword_found(text: str, keywords: List[str]) -> bool:
    """Return True if any of the given keywords appears in the text."""
    return any(k in text for k in keywords)


def _count_matches(text: str, keyword_groups: List[List[str]]) -> int:
    """
    Count how many groups have at least one keyword present in the text.
    Each group is a list of strings.
    """
    count = 0
    for group in keyword_groups:
        if _keyword_found(text, group):
            count += 1
    return count


def evaluate_project(project: ProjectInput) -> EvaluationResult:
    text = (project.title + " " + project.description + " " + " ".join(project.tech_tags)).lower()

    # --- 1. Keyword groups (FLATTENED!) ---

    # Each of these is now List[str], not List[List[str]]
    ml_keywords = ["machine learning", "ml", "supervised", "unsupervised"]
    dl_keywords = ["deep learning", "neural network", "cnn", "rnn", "lstm", "transformer"]
    cv_keywords = ["computer vision", "image processing", "opencv"]
    nlp_keywords = ["nlp", "natural language", "bert", "gpt", "sentiment"]
    data_stream_keywords = ["real-time", "streaming", "kafka", "spark", "flink"]
    blockchain_keywords = ["blockchain", "smart contract", "solana", "ethereum", "web3"]
    iot_keywords = ["iot", "sensor", "arduino", "raspberry pi", "microcontroller", "edge device"]
    mobile_keywords = ["android", "ios", "react native", "flutter", "mobile app"]
    web_keywords = ["web app", "react", "angular", "vue", "frontend", "dashboard", "portal"]
    security_keywords = ["encryption", "cybersecurity", "penetration testing", "auth", "authorization"]
    optimization_keywords = ["optimization", "heuristic", "metaheuristic", "genetic algorithm"]

    nonfunctional_keywords_groups = [
        ["real-time", "low latency", "high throughput"],
        ["high availability", "fault tolerant", "failover"],
        ["scalable", "scalability", "distributed system", "distributed"],
    ]

    data_complex_keywords_groups = [
        ["big data", "large-scale", "millions of", "billions of"],
        ["time series", "multivariate", "high dimensional"],
        ["unstructured data", "logs", "images", "video", "audio"],
    ]

    integration_keywords_groups = [
        ["api integration", "third-party api", "external api"],
        ["payment gateway", "stripe", "paypal"],
        ["external service", "webhook"],
    ]

    # Technical breadth: how many distinct domains are involved
    breadth_domains = [
        ml_keywords,
        dl_keywords,
        cv_keywords,
        nlp_keywords,
        data_stream_keywords,
        blockchain_keywords,
        iot_keywords,
        mobile_keywords,
        web_keywords,
        security_keywords,
        optimization_keywords,
    ]

    technical_breadth = _count_matches(text, breadth_domains)
    technical_breadth = clamp(technical_breadth, 0, 10)

    # --- 2. Technical depth ---

    depth_score = 0.0
    if _keyword_found(text, dl_keywords):
        depth_score += 3
    if _keyword_found(text, data_stream_keywords):
        depth_score += 2
    if _keyword_found(text, blockchain_keywords + ["consensus"]):
        depth_score += 2
    if _keyword_found(text, optimization_keywords):
        depth_score += 2
    if _keyword_found(text, ["real-time", "low latency"]):
        depth_score += 1

    # baseline depth if some domains but no advanced keywords
    if technical_breadth > 0 and depth_score == 0:
        depth_score = 2

    depth_score = clamp(depth_score, 0, 10)

    # --- 3. Non-functional complexity ---

    nonfunctional_complexity = 0.0
    if _keyword_found(text, ["real-time", "low latency", "high throughput"]):
        nonfunctional_complexity += 3
    if _keyword_found(text, ["scalable", "scalability", "distributed", "distributed system"]):
        nonfunctional_complexity += 2
    if _keyword_found(text, ["high availability", "fault tolerant", "failover"]):
        nonfunctional_complexity += 2
    nonfunctional_complexity = clamp(nonfunctional_complexity, 0, 10)

    # --- 4. Data complexity ---

    data_complexity = 0.0
    if _keyword_found(text, ["big data", "large-scale"]):
        data_complexity += 3
    if _keyword_found(text, ["images", "video", "audio"]):
        data_complexity += 2
    if _keyword_found(text, ["time series", "multivariate"]):
        data_complexity += 2
    data_complexity = clamp(data_complexity, 0, 10)

    # --- 5. Integration complexity ---

    integration_complexity = 0.0
    if _keyword_found(text, ["api integration", "third-party api", "webhook"]):
        integration_complexity += 2
    if _keyword_found(text, ["payment", "stripe", "paypal"]):
        integration_complexity += 2
    if _keyword_found(text, iot_keywords):
        integration_complexity += 2
    integration_complexity = clamp(integration_complexity, 0, 10)

    # --- 6. Novelty / real-world relevance (rough heuristic) ---

    novelty_score = 5.0
    if _keyword_found(text, ["smart city", "healthcare", "education", "finance", "agriculture"]):
        novelty_score += 1
    if _keyword_found(text, ["research", "novel", "state-of-the-art", "sota"]):
        novelty_score += 1
    novelty_score = clamp(novelty_score, 0, 10)

    # --- 7. Difficulty score ---

    difficulty_score = (
        0.35 * technical_breadth
        + 0.35 * depth_score
        + 0.15 * integration_complexity
        + 0.15 * data_complexity
    )
    difficulty_score = clamp(difficulty_score, 0, 10)

    # --- 8. Feasibility score ---

    feasibility_score = 10 - max(0.0, difficulty_score - 4) * 1.2

    months = project.duration_weeks / 4.0
    team = project.team_size

    if difficulty_score > 7 and team <= 2:
        feasibility_score -= 2.0
    if difficulty_score > 8 and team == 1:
        feasibility_score -= 2.0

    if difficulty_score > 7 and months < 4:
        feasibility_score -= 2.0
    if difficulty_score > 6 and months < 3:
        feasibility_score -= 1.5

    feasibility_score = clamp(feasibility_score, 0, 10)

    # --- 9. Marks potential (/100) ---

    marks_potential = 40 + difficulty_score * 4 + novelty_score * 2
    marks_potential += (feasibility_score - 5) * 1.5
    marks_potential = clamp(marks_potential, 0, 100)

    # --- 10. Labels ---

    if difficulty_score < 3:
        difficulty_label = "Too Easy"
    elif difficulty_score < 6:
        difficulty_label = "Reasonable"
    elif difficulty_score < 8:
        difficulty_label = "Challenging but Feasible"
    else:
        difficulty_label = "Very Challenging / High Risk"

    if feasibility_score < 3:
        feasibility_label = "Low Feasibility (Unrealistic as described)"
    elif feasibility_score < 6:
        feasibility_label = "Moderate Feasibility (Scope / risk needs control)"
    else:
        feasibility_label = "Good Feasibility"

    # --- 11. Recommended tech stack ---

    frontend: List[str] = []
    backend: List[str] = []
    database = ["PostgreSQL"]

    if _keyword_found(text, ["web", "dashboard", "portal", "web app"]):
        frontend.append("React")
    if _keyword_found(text, ["mobile", "android", "ios"]):
        frontend.append("React Native / Flutter")
    if not frontend:
        frontend.append("React")

    if _keyword_found(text, data_stream_keywords):
        backend.append("FastAPI or Node.js (Express) + Kafka")
    else:
        backend.append("FastAPI or Node.js (Express)")

    ml_stack = None
    if _keyword_found(text, ml_keywords + dl_keywords + cv_keywords + nlp_keywords):
        ml_stack = ["Python", "PyTorch / TensorFlow", "scikit-learn"]

    blockchain_stack = None
    if _keyword_found(text, blockchain_keywords):
        blockchain_stack = ["Solidity / Rust", "Web3.js / ethers.js"]

    devops = ["Docker"]
    if _keyword_found(text, ["cloud", "deployment"]):
        devops.append("CI/CD (GitHub Actions)")

    recommended_stack = RecommendedTechStack(
        frontend=list(set(frontend)),
        backend=list(set(backend)),
        database=database,
        ml_stack=ml_stack,
        blockchain=blockchain_stack,
        devops=devops,
    )

    # --- 12. Suggestions ---

    suggestions: List[str] = []

    if difficulty_score < 3:
        suggestions.append(
            "The project looks quite simple. Consider adding an analytics dashboard, performance evaluation, or an AI/ML component to increase depth."
        )

    if 3 <= difficulty_score < 6:
        suggestions.append(
            "Difficulty is reasonable. You can strengthen the project by clearly defining evaluation metrics and including a small performance or usability study."
        )

    if difficulty_score > 8:
        suggestions.append(
            "The project is very challenging. Consider removing one advanced component (e.g., deep learning, blockchain, or real-time streaming) and focusing on a core subset."
        )

    if feasibility_score < 5:
        suggestions.append(
            f"For a team of {team} over {round(months, 1)} months, this scope is risky. Start with a minimal prototype (Phase 1) and only add advanced features if time permits."
        )

    if ml_stack and "dataset" not in text:
        suggestions.append(
            "You mention ML/AI but not the dataset. Clarify the source, size, and labeling of your data to make the project more concrete."
        )

    if blockchain_stack and not _keyword_found(text, ["use case", "problem", "why blockchain"]):
        suggestions.append(
            "Explain why blockchain is needed instead of a normal database to strengthen the justification."
        )

    suggestions.append(
        "Prepare a clear problem statement, objectives, and a Gantt chart. Supervisors usually care a lot about planning and clarity, not just technology."
    )

    raw_dimension_scores = {
        "technical_breadth": technical_breadth,
        "technical_depth": depth_score,
        "nonfunctional_complexity": nonfunctional_complexity,
        "data_complexity": data_complexity,
        "integration_complexity": integration_complexity,
    }

    return EvaluationResult(
        difficulty_score=round(difficulty_score, 2),
        feasibility_score=round(feasibility_score, 2),
        marks_potential=round(marks_potential, 1),
        difficulty_label=difficulty_label,
        feasibility_label=feasibility_label,
        novel_idea_score=round(novelty_score, 2),
        recommended_tech_stack=recommended_stack,
        suggestions=suggestions,
        raw_dimension_scores=raw_dimension_scores,
    )
