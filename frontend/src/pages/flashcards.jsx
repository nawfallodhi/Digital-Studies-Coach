import { useState } from "react";
import "../styles/flashcards.css";
import RichText from "../math_format";

const Flash = () => {
  const [topic, setTopic] = useState("");
  const [simplicity, setSimplicity] = useState("");
  const [numCards, setNumCards] = useState(7);
  const [specificDeets, setSpecificDeets] = useState("");

  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      return alert("Please enter a flashcard topic");
    }

    setLoading(true);
    setFlashcards(null);
    setCurrentIndex(0);
    setIsFlipped(false);

    const prompt = `Create a flashcard set with exactly ${numCards} flashcards.

Topic: ${topic}
Simplicity: ${simplicity}
Focus areas: ${specificDeets}

JSON Structure:
{
  "flashcards": [
    {
      "id": 1,
      "question": "Front of card - question or term (use $...$ for math)",
      "answer": "Back of card - detailed explanation or definition (use $...$ for math)"
    }
  ]
}

Requirements:
- Exactly ${numCards} flashcards
- Cover all requested content thoroughly but simply
- Appropriate for ${simplicity} level
- Questions should be clear and concise
- Answers should be comprehensive but digestible
- Use LaTeX ($...$) for any mathematical notation
- Return ONLY the JSON, no other text
`;

    try {
      const res = await fetch("http://127.0.0.1:8000/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          topic: "flashcard_generator",
          question: prompt,
        }),
      });

      const data = await res.json();
      console.log("Raw API response:", data.answer);

      try {
        // Parse the JSON response
        let cleanedAnswer = data.answer.trim();

        // Remove markdown code blocks if present
        cleanedAnswer = cleanedAnswer
          .replace(/```json\s*/gi, "")
          .replace(/```\s*/g, "");

        // Extract JSON
        const firstBrace = cleanedAnswer.indexOf("{");
        const lastBrace = cleanedAnswer.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1) {
          throw new Error("No JSON object found");
        }

        cleanedAnswer = cleanedAnswer.substring(firstBrace, lastBrace + 1);

        const flashData = JSON.parse(cleanedAnswer);

        // Validate structure
        if (!flashData.flashcards || !Array.isArray(flashData.flashcards)) {
          throw new Error("Invalid flashcard structure");
        }

        // Normalize flashcards
        flashData.flashcards = flashData.flashcards.map((card, i) => ({
          ...card,
          id: card.id || i + 1,
        }));

        setFlashcards(flashData);
      } catch (parseError) {
        console.error("Parse error:", parseError);
        alert("Error parsing flashcards. Please try again.");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Error generating flashcards. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setFlashcards(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    setTopic("");
    setSimplicity("");
    setNumCards(7);
    setSpecificDeets("");
  };

  const handleCardClick = (index) => {
    setCurrentIndex(index);
    setIsFlipped(false);
  };

  return (
    <div className="flashcard-container">
      <h2>Flashcard Generator</h2>

      {!flashcards ? (
        <div className="flashcard-setup">
          <input
            placeholder="Topic (e.g., Spanish Verbs, Chemical Reactions)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <select
            value={simplicity}
            onChange={(e) => setSimplicity(e.target.value)}
          >
            <option value="">Select Simplicity Level</option>
            <option value="Very Simple">Very Simple</option>
            <option value="Simple">Simple</option>
            <option value="Moderate">Moderate</option>
            <option value="Detailed">Detailed</option>
            <option value="Advanced">Advanced</option>
          </select>

          <div className="number-input">
            <label>Number of Cards:</label>
            <input
              type="number"
              min="1"
              max="50"
              value={numCards}
              onChange={(e) => setNumCards(parseInt(e.target.value) || 7)}
            />
          </div>

          <textarea
            placeholder="Specific details or focus areas (optional)"
            value={specificDeets}
            onChange={(e) => setSpecificDeets(e.target.value)}
          />

          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating Flashcards..." : "Generate Flashcards"}
          </button>
        </div>
      ) : (
        <div className="flashcard-viewer">
          <div className="progress-bar">
            <span className="progress-text">
              Card {currentIndex + 1} of {flashcards.flashcards.length}
            </span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentIndex + 1) / flashcards.flashcards.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div
            className={`flashcard ${isFlipped ? "flipped" : ""}`}
            onClick={handleFlip}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div className="card-label">Question</div>
                <div className="card-content">
                  <RichText>
                    {flashcards.flashcards[currentIndex].question}
                  </RichText>
                </div>
                <div className="flip-hint">Click to flip</div>
              </div>
              <div className="flashcard-back">
                <div className="card-label">Answer</div>
                <div className="card-content">
                  <RichText>
                    {flashcards.flashcards[currentIndex].answer}
                  </RichText>
                </div>
                <div className="flip-hint">Click to flip</div>
              </div>
            </div>
          </div>

          <div className="navigation-controls">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="nav-btn"
            >
              ← Previous
            </button>
            <button onClick={handleFlip} className="flip-btn">
              {isFlipped ? "Show Question" : "Show Answer"}
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.flashcards.length - 1}
              className="nav-btn-2"
            >
              Next →
            </button>
          </div>

          <div className="card-grid">
            {flashcards.flashcards.map((card, index) => (
              <div
                key={card.id}
                className={`card-thumbnail ${index === currentIndex ? "active" : ""}`}
                onClick={() => handleCardClick(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>

          <button onClick={handleReset} className="reset-btn">
            Create New Set
          </button>
        </div>
      )}
    </div>
  );
};

export default Flash;