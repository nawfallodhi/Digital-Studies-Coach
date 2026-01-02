import { useState } from "react";
import "../styles/quizes.css";
import RichText from "../math_format";

const Quiz = () => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [focus, setFocus] = useState("");

  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

const handleGenerate = async () => {
  if (!topic) return alert("Please enter a quiz topic.");

  setLoading(true);
  setQuiz(null);
  setUserAnswers({});
  setSubmitted(false);
  setScore(null);

  const prompt = `
Create a quiz with exactly ${numQuestions} multiple choice questions.

Topic: ${topic}
Level: ${level}
Focus areas: ${focus}

CRITICAL: Return ONLY valid JSON with NO additional text, explanations, or markdown.

Use this EXACT structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correctAnswer": "A",
      "explanation": "Why this answer is correct"
    }
  ]
}

Requirements:
- correctAnswer must be exactly one letter: A, B, C, or D
- Each question must have exactly 4 options starting with A), B), C), D)
- Make questions appropriate for ${level} level
- NO text before or after the JSON
`;

  try {
    const res = await fetch("http://127.0.0.1:8000/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        topic: "quiz_generator",
        question: prompt,
      }),
    });

    const data = await res.json();
    console.log("Raw API response:", data.answer); // Debug log
    
    // Parse the JSON response with multiple fallback strategies
    try {
      let cleanedAnswer = data.answer.trim();
      
      // Strategy 1: Remove markdown code blocks
      cleanedAnswer = cleanedAnswer.replace(/```json\s*/g, "").replace(/```\s*/g, "");
      
      // Strategy 2: Extract JSON between curly braces
      const jsonMatch = cleanedAnswer.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedAnswer = jsonMatch[0];
      }
      
      // Strategy 3: Remove any leading/trailing text
      const firstBrace = cleanedAnswer.indexOf('{');
      const lastBrace = cleanedAnswer.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedAnswer = cleanedAnswer.substring(firstBrace, lastBrace + 1);
      }
      
      console.log("Cleaned answer:", cleanedAnswer); // Debug log
      
      const quizData = JSON.parse(cleanedAnswer);
      
      // Validate the structure
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error("Invalid quiz structure: missing questions array");
      }
      
      if (quizData.questions.length === 0) {
        throw new Error("No questions generated");
      }
      
      // Validate each question
      quizData.questions.forEach((q, index) => {
        if (!q.id) q.id = index + 1;
        if (!q.question || !q.options || !q.correctAnswer || !q.explanation) {
          throw new Error(`Question ${index + 1} is missing required fields`);
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Question ${index + 1} must have exactly 4 options`);
        }
        // Normalize correctAnswer to uppercase
        q.correctAnswer = q.correctAnswer.trim().toUpperCase();
        if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
          throw new Error(`Question ${index + 1} has invalid correctAnswer: ${q.correctAnswer}`);
        }
      });
      
      setQuiz(quizData);
      
      // Initialize user answers
      const initialAnswers = {};
      quizData.questions.forEach(q => {
        initialAnswers[q.id] = null;
      });
      setUserAnswers(initialAnswers);
      
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.error("Failed to parse:", data.answer);
      alert(`Error parsing quiz data: ${parseError.message}\n\nPlease try again. The AI may not have returned valid JSON.`);
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("Error generating quiz. Please check your connection and try again.");
  } finally {
    setLoading(false);
  }
};

  const handleAnswerSelect = (questionId, answer) => {
    if (submitted) return; // Prevent changing answers after submission
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const unanswered = quiz.questions.filter(q => !userAnswers[q.id]);
    if (unanswered.length > 0) {
      return alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
    }

    // Calculate score
    let correct = 0;
    quiz.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    setScore({
      correct,
      total: quiz.questions.length,
      percentage: ((correct / quiz.questions.length) * 100).toFixed(1)
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setQuiz(null);
    setUserAnswers({});
    setSubmitted(false);
    setScore(null);
    setTopic("");
    setLevel("");
    setNumQuestions(5);
    setFocus("");
  };

  return (
    <div className="quiz-container">
      <h2>Quiz Generator</h2>

      {!quiz ? (
        <div className="quiz-setup">
          <input
            placeholder="Quiz Topic (e.g., Calculus, World History)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <div className="number-input">
            <label>Number of Questions:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
            />
          </div>

          <textarea
            placeholder="Focus areas (optional - e.g., derivatives, integration)"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          />

          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating Quiz..." : "Generate Quiz"}
          </button>
        </div>
      ) : (
        <div className="quiz-content">
          {score && (
            <div className={`score-banner ${score.percentage >= 70 ? "pass" : "fail"}`}>
              <h3>Quiz Results</h3>
              <div className="score-details">
                <p className="score-big">{score.percentage}%</p>
                <p>{score.correct} out of {score.total} correct</p>
              </div>
            </div>
          )}

          <div className="quiz-questions">
            {quiz.questions.map((q, index) => {
              const isCorrect = submitted && userAnswers[q.id] === q.correctAnswer;
              const isWrong = submitted && userAnswers[q.id] !== q.correctAnswer;

              return (
                <div key={q.id} className={`question-card ${submitted ? (isCorrect ? "correct" : "incorrect") : ""}`}>
                  <div className="question-header">
                    <span className="question-number">Question {index + 1}</span>
                    {submitted && (
                      <span className={`result-badge ${isCorrect ? "correct" : "incorrect"}`}>
                        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    )}
                  </div>
                  
                  <div className="question-text">
                    <RichText>{q.question}</RichText>
                  </div>

                  <div className="options">
                    {q.options.map((option) => {
                      const optionLetter = option.charAt(0);
                      const isSelected = userAnswers[q.id] === optionLetter;
                      const isCorrectOption = optionLetter === q.correctAnswer;
                      
                      let optionClass = "option";
                      if (submitted) {
                        if (isCorrectOption) {
                          optionClass += " correct-option";
                        } else if (isSelected && !isCorrectOption) {
                          optionClass += " wrong-option";
                        }
                      } else if (isSelected) {
                        optionClass += " selected";
                      }

                      return (
                        <div
                          key={optionLetter}
                          className={optionClass}
                          onClick={() => handleAnswerSelect(q.id, optionLetter)}
                        >
                          <RichText>{option}</RichText>
                        </div>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="explanation">
                      <strong>Explanation:</strong>
                      <RichText>{q.explanation}</RichText>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="quiz-actions">
            {!submitted ? (
              <button onClick={handleSubmit} className="submit-btn">
                Submit Quiz
              </button>
            ) : (
              <button onClick={handleReset} className="reset-btn">
                Create New Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;