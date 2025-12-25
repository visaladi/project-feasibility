import React from "react";

export default function ResultPanel({ result }) {
  if (!result) {
    return (
      <div
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "1rem",
          border: "1px dashed #374151",
          color: "#9ca3af",
          fontSize: "0.9rem",
        }}
      >
        Submit a project idea to see the evaluation here.
      </div>
    );
  }

  const {
    difficulty_score,
    feasibility_score,
    marks_potential,
    difficulty_label,
    feasibility_label,
    novel_idea_score,
    recommended_tech_stack,
    suggestions,
    raw_dimension_scores,
  } = result;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "1rem",
          border: "1px solid #1f2937",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Summary</h2>
        <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "#9ca3af" }}>
          Difficulty: <strong>{difficulty_label}</strong> ({difficulty_score}/10)
          <br />
          Feasibility: <strong>{feasibility_label}</strong> ({feasibility_score}/10)
          <br />
          Estimated marks potential: <strong>{marks_potential.toFixed(1)}/100</strong>
          <br />
          Novelty / real-world relevance: <strong>{novel_idea_score}/10</strong>
        </p>
      </div>

      <div
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "1rem",
          border: "1px solid #1f2937",
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Dimension breakdown</h3>
        <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem", fontSize: "0.9rem" }}>
          <li>Technical breadth: {raw_dimension_scores.technical_breadth}/10</li>
          <li>Technical depth: {raw_dimension_scores.technical_depth}/10</li>
          <li>Non-functional complexity: {raw_dimension_scores.nonfunctional_complexity}/10</li>
          <li>Data complexity: {raw_dimension_scores.data_complexity}/10</li>
          <li>Integration complexity: {raw_dimension_scores.integration_complexity}/10</li>
        </ul>
      </div>

      <div
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "1rem",
          border: "1px solid #1f2937",
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Suggested tech stack</h3>
        <div style={{ fontSize: "0.9rem", color: "#e5e7eb" }}>
          <p>
            <strong>Frontend:</strong> {recommended_tech_stack.frontend.join(", ")}
          </p>
          <p>
            <strong>Backend:</strong> {recommended_tech_stack.backend.join(", ")}
          </p>
          <p>
            <strong>Database:</strong> {recommended_tech_stack.database.join(", ")}
          </p>
          {recommended_tech_stack.ml_stack && (
            <p>
              <strong>ML Stack:</strong> {recommended_tech_stack.ml_stack.join(", ")}
            </p>
          )}
          {recommended_tech_stack.blockchain && (
            <p>
              <strong>Blockchain:</strong> {recommended_tech_stack.blockchain.join(", ")}
            </p>
          )}
          <p>
            <strong>DevOps:</strong> {recommended_tech_stack.devops.join(", ")}
          </p>
        </div>
      </div>

      <div
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "1rem",
          border: "1px solid #1f2937",
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Smart suggestions</h3>
        <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem", fontSize: "0.9rem" }}>
          {suggestions.map((s, idx) => (
            <li key={idx} style={{ marginBottom: "0.4rem" }}>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
