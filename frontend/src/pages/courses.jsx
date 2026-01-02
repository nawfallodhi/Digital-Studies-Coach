import { useState } from "react";
import "../styles/courses.css"
import RichText from "../math_format";

const Courses = () => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [background, setBackground] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [goal, setGoal] = useState("");

  const [loading, setLoading] = useState(false);
  const [coursePlan, setCoursePlan] = useState("");

  const handleGenerate = async () => {
    if (!topic) return alert("Please enter a course topic.");

    setLoading(true);
    setCoursePlan("");

    const prompt = `
Create a structured learning course.

Topic: ${topic}
Level: ${level}
Student background: ${background}
Timeframe: ${timeframe}
Goal: ${goal}
`;

    try {
      const res = await fetch("http://127.0.0.1:8000/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          topic: "course_planner",
          question: prompt,
        }),
      });

      const data = await res.json();
      setCoursePlan(data.answer);
    } catch (err) {
      console.error(err);
      setCoursePlan("Error generating course plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courses-container">
      <h2>Create a Course Plan</h2>

      <input
        placeholder="Course / Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <input
        placeholder="Level (Beginner / Intermediate / Advanced)"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      />

      <textarea
        placeholder="Student background / prerequisites"
        value={background}
        onChange={(e) => setBackground(e.target.value)}
      />

      <input
        placeholder="Timeframe (e.g. 4 weeks)"
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
      />

      <textarea
        placeholder="Goal (exam prep, mastery, practical skills)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Course Plan"}
      </button>

      {coursePlan && (
        <div className="course-plan-output">
          <h3>Generated Course Plan</h3>
          <RichText>{coursePlan}</RichText>
        </div>
      )}
    </div>
  );
};

export default Courses;