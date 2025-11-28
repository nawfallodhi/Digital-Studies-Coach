import { useEffect, useState } from "react";
import { MarkdownAsync } from "react-markdown";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("http://localhost:8000/ai/history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>API Request History</h1>
      <hr />

      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {history.map((item) => (
            <li
              key={item.id}
              style={{
                background: "#f1f1f1",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <p><strong>Topic:</strong> {item.topic}</p>
              <p><strong>Prompt:</strong> {item.question}</p>
              <p><strong>Response:</strong>{item.answer}</p>
              <p style={{ fontSize: "12px", color: "#666" }}>
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}