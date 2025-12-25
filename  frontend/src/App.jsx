import React, { useState } from "react";
import ProjectForm from "./components/ProjectForm";
import ResultPanel from "./components/ResultPanel";
import { evaluateProject } from "./api";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEvaluate = async (payload) => {
    try {
      setLoading(true);
      setErrorMsg("");
      setResult(null);
      const res = await evaluateProject(payload);
      setResult(res);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error while evaluating project. Check backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #1e293b, #020617 55%)",
        padding: "2rem 1rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "1.8rem",
              background:
                "linear-gradient(135deg, #22c55e, #22d3ee)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Project Complexity & Feasibility Evaluator
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "#9ca3af" }}>
            Paste your university project idea and get an instant evaluation of difficulty,
            feasibility, and marks potential – with suggestions to adjust scope.
          </p>
        </header>

        <main
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.2fr)",
            gap: "1.5rem",
          }}
        >
          <ProjectForm onSubmit={handleEvaluate} loading={loading} />
          <div>
            {errorMsg && (
              <div
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  background: "#450a0a",
                  color: "#fecaca",
                  fontSize: "0.9rem",
                }}
              >
                {errorMsg}
              </div>
            )}
            <ResultPanel result={result} />
          </div>
        </main>

        <footer
          style={{
            marginTop: "2rem",
            fontSize: "0.8rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Tip: Show this evaluation to your supervisor when proposing your idea.
        </footer>
      </div>
    </div>
  );
}
