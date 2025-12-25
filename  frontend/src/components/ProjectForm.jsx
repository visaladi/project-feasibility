import React, { useState } from "react";

const degreeOptions = ["Diploma", "BSc", "MSc", "Other"];
const courseOptions = ["FYP", "MiniProject", "Assignment", "Other"];

export default function ProjectForm({ onSubmit, loading }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("BSc");
  const [courseType, setCourseType] = useState("FYP");
  const [teamSize, setTeamSize] = useState(2);
  const [durationWeeks, setDurationWeeks] = useState(16);
  const [techTags, setTechTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      degree_level: degreeLevel,
      course_type: courseType,
      team_size: Number(teamSize),
      duration_weeks: Number(durationWeeks),
      tech_tags: techTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#020617",
        padding: "1.5rem",
        borderRadius: "1rem",
        border: "1px solid #1f2937",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div>
        <label style={{ fontSize: "0.9rem", color: "#9ca3af" }}>Project Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="AI-Assisted Traffic Monitoring System"
          style={{
            width: "100%",
            marginTop: "0.25rem",
            padding: "0.6rem 0.8rem",
            borderRadius: "0.75rem",
            border: "1px solid #374151",
            background: "#020617",
            color: "#e5e7eb",
          }}
        />
      </div>

      <div>
        <label style={{ fontSize: "0.9rem", color: "#9ca3af" }}>Project Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="Describe your idea, technologies, and goals..."
          style={{
            width: "100%",
            marginTop: "0.25rem",
            padding: "0.6rem 0.8rem",
            borderRadius: "0.75rem",
            border: "1px solid #374151",
            background: "#020617",
            color: "#e5e7eb",
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "160px" }}>
          <label style={{ fontSize: "0.9rem", color: "#9ca3af" }}>Degree Level</label>
          <select
            value={degreeLevel}
            onChange={(e) => setDegreeLevel(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.25rem",
              padding: "0.6rem 0.8rem",
              borderRadius: "0.75rem",
              border: "1px solid #374151",
              background: "#020617",
              color: "#e5e7eb",
            }}
          >
            {degreeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: "160px" }}>
          <label style={{ fontSize: "0.9rem", color: "#9ca3af" }}>Course Type</label>
          <select
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.25rem",
              padding: "0.6rem 0.8rem",
              borderRadius: "0.75rem",
              border: "1px solid #374151",
              background: "#020617",
              color: "#e5e7eb",
            }}
          >
            {courseOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "120px" }}>
          <label style={{ fontSize: "0.9rem", color: "#9ca3af" }}>Team Size</label>
          <input
            type="number"
            min={1}
            max={10}
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.25rem",
              padding: "0.6rem 0.8rem",
              borderRadius: "0.75rem",
              border: "1px solid #374151",
              background: "#020617",
              color: "#e5e7eb",
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: "120px" }}>
          <label style={{ fontSize: "0.9rem", color: "#9ca3af" }}>Duration (weeks)</label>
          <input
            type="number"
            min={1}
            max={52}
            value={durationWeeks}
            onChange={(e) => setDurationWeeks(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.25rem",
              padding: "0.6rem 0.8rem",
              borderRadius: "0.75rem",
              border: "1px solid #374151",
              background: "#020617",
              color: "#e5e7eb",
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
          Tech Tags (comma-separated, optional)
        </label>
        <input
          type="text"
          value={techTags}
          onChange={(e) => setTechTags(e.target.value)}
          placeholder="React, FastAPI, Kafka, Blockchain, Computer Vision"
          style={{
            width: "100%",
            marginTop: "0.25rem",
            padding: "0.6rem 0.8rem",
            borderRadius: "0.75rem",
            border: "1px solid #374151",
            background: "#020617",
            color: "#e5e7eb",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: "0.5rem",
          padding: "0.7rem 1rem",
          borderRadius: "999px",
          border: "none",
          background:
            "linear-gradient(135deg, #22c55e, #22d3ee)",
          color: "#020617",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Evaluating..." : "Evaluate Project"}
      </button>
    </form>
  );
}
