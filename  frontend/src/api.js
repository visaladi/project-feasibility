const API_BASE_URL = "http://localhost:8000";

export async function evaluateProject(payload) {
  const res = await fetch(`${API_BASE_URL}/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to evaluate project");
  }

  return res.json();
}
