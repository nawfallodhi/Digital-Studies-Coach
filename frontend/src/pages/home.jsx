import { Link } from "react-router";
import "../styles/home.css"

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to Digital Studies Coach!</h1>
        <p>Your AI-powered study companion for Math, Science, and more.</p>
        <button>
          <Link to="/discuss">Ask a question!</Link>
        </button>
      </section>

      <section className="features">
        <h2>What We Offer</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>AI Tutor for Math</h3>
            <p>Get step-by-step solutions and explanations.</p>
          </div>
          <div className="card">
            <h3>Science Insights</h3>
            <p>Understand complex concepts easily.</p>
          </div>
          <div className="card">
            <h3>Quick Tips</h3>
            <p>Study smarter with targeted advice.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Learn?</h2>
        <button>
          <Link to="/discuss">Start Tutoring!</Link>
        </button>
      </section>

      <footer className="footer">
        <p>© 2025 Digital Studies Coach</p>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
