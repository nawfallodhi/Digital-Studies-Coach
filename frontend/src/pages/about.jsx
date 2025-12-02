import "../styles/about.css"

const About = () => {
    return (
        <div className="about-container">
            <h1>About Digital Studies Coach</h1>

            <p className="about-tagline">
                Your personalized AI tutor for learning smarter, not harder.
            </p>

            <section className="about-section">
                <h2> What Is This Platform?</h2>
                <p>
                    Digital Studies Coach is an AI-powered academic assistant designed to help 
                    students master difficult concepts, review course material, and stay on top of 
                    their studies. Whether it’s understanding math, generating study notes, or 
                    reviewing your learning history, our platform adapts to your needs.
                </p>
            </section>

            <section className="about-section">
                <h2> Why I Built It</h2>
                <p>
                    Many students struggle not because they’re incapable, but because traditional 
                    learning tools are rigid and outdated. Digital Studies Coach uses the latest 
                    AI technology to break down complex topics into simple, digestible explanations 
                    tailored just for you.
                </p>
            </section>

            <section className="about-section">
                <h2>What You Can Do Here</h2>
                <ul>
                    <li>Get personalized explanations using our <strong>Concept Reinforcer</strong></li>
                    <li>Review your previous learning with the <strong>Request History</strong></li>
                    <li>Practice and improve with upcoming <strong>Quizzes</strong> and <strong>Flashcards</strong></li>
                    <li>Explore curated academic <strong>Courses</strong></li>
                    <li>Interact with a clean, distraction-free tutoring interface</li>
                </ul>
            </section>

            <section className="about-section">
                <h2>Our Mission</h2>
                <p>
                    To provide accessible, personalized, AI-driven education for students everywhere,
                    helping them build confidence, curiosity, and mastery in every subject.
                </p>
            </section>

            <footer className="about-footer">
                Built using FastAPI, React, and modern AI technologies.
            </footer>
        </div>
    );
};

export default About;
