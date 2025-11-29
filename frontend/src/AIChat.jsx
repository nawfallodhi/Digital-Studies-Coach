import { useState } from "react";
import "./App.css";
import { MathJax } from "better-react-mathjax";
import Markdown from "react-markdown";
import RichText from "./math_format";

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("http://127.0.0.1:8000/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: "general",  // or you can add a topic input later
          question: question,
        }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Error: could not generate response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      <h2>Explain a concept to me!</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question here..."
        rows={4}
      />
      <br />
      <button onClick={handleGenerate}>
        {loading ? "Generating..." : "Generate"}
      </button>
      {answer && (
        <div className="answer-box">
          <strong>Answer:</strong>
            <RichText>
              {answer}
            </RichText>
        </div>
      )}
    </div>
  );
}
