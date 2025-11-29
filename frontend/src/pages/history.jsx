import { useEffect, useState } from "react";
import "../styles/history.css"
import RichText from "../math_format";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const token = localStorage.getItem("token");
        
        const res = await fetch("http://localhost:8000/ai/history",{
          headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if(!res.ok){
          console.error("Unauthorized or failed:",res.status)
        }

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

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="history-container">
      <h1>API Request History</h1>
      <hr />

      {history.length === 0 ? (
        <p className="empty-text">No history yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id} className="history-item">
              <div className="topic"><strong>Topic:</strong><RichText>{item.topic}</RichText></div>
              <div className="prompt"><strong>Prompt:</strong><RichText>{item.question}</RichText></div>
              <div className="response"><strong>Response:</strong><RichText>{item.answer}</RichText></div>
              <div className="timestamp">
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}