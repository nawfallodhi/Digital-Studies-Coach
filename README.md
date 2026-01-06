# 🎓 Digital AI Tutor

A comprehensive AI-powered learning platform that helps students create personalized study materials, practice with quizzes, and get instant answers to their questions.

## Features

### Course Planning
- Generate structured learning courses on any topic
- Customize by experience level (Beginner, Intermediate, Advanced)
- Set specific timeframes and learning goals
- Tailored content based on student background and prerequisites

### Flashcard Generator
- Create interactive flashcards for any subject
- Flip cards to reveal answers with smooth 3D animations
- Adjustable simplicity levels (Very Simple to Advanced)
- Navigate through cards with intuitive controls
- Track progress with visual indicators
- Support for mathematical notation using LaTeX

### Quiz Generator
- Generate multiple-choice quizzes on any topic
- Customizable difficulty levels
- Instant feedback with correct/incorrect highlighting
- Detailed explanations for each answer
- Score tracking and performance analytics
- Support for LaTeX mathematical expressions

### AI Tutor Chat
- Ask questions about any topic
- Get instant, detailed explanations
- Mathematical notation rendering with LaTeX
- Markdown formatting for clear, structured responses
- View conversation history

## Tech Stack

### Frontend
- **React** (Vite) - Fast, modern UI framework
- **React Router** - Navigation and routing
- **CSS3** - Custom styling with animations
- **LaTeX Rendering** - Mathematical notation support

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL/SQLite** - Data persistence
- **OpenRouter API** - AI model integration (Llama 3.3 70B)
- **JWT Authentication** - Secure user sessions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.9 or higher)
- pip (Python package manager)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd digital-ai-tutor
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Add your OpenRouter API key:
# OPENROUTER_API_KEY=your_api_key_here

# Run database migrations (if applicable)
# alembic upgrade head

# Start the backend server
uvicorn main:app --reload
```

The backend will run on `http://127.0.0.1:8000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Environment Variables

Create a `.env` file in the backend directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
DATABASE_URL=sqlite:///./database.db  # or your PostgreSQL URL
SECRET_KEY=your_jwt_secret_key
```

## 📖 Usage

### Creating an Account
1. Navigate to the registration page
2. Enter your email and password
3. Click "Sign Up"

### Generating a Course Plan
1. Click on "Courses" in the navigation
2. Enter your desired topic
3. Select experience level
4. Add student background information
5. Set timeframe and learning goals
6. Click "Generate Course Plan"

### Creating Flashcards
1. Navigate to "Flashcards"
2. Enter the topic you want to study
3. Choose simplicity level
4. Set number of cards
5. Click "Generate Flashcards"
6. Click cards to flip and reveal answers
7. Use Previous/Next buttons to navigate

### Taking a Quiz
1. Go to "Quiz" section
2. Enter quiz topic
3. Select difficulty level
4. Choose number of questions
5. Click "Generate Quiz"
6. Answer all questions
7. Submit to see your score and explanations

### Asking Questions
1. Navigate to the main tutor interface
2. Type your question in the input field
3. Receive instant AI-powered responses
4. View history of past questions

## Features in Detail

### LaTeX Math Support
The platform supports mathematical notation using LaTeX:
- Inline math: `$x^2 + y^2 = z^2$`
- Block math: `$$\int_{0}^{\infty} e^{-x} dx$$`
- Fractions, integrals, summations, and more

### Smart JSON Parsing
- Backend automatically repairs malformed JSON from AI
- Handles LaTeX escape characters correctly
- Ensures data integrity for quizzes and flashcards

### Request History
- All AI interactions are saved to your account
- Review past course plans, quizzes, and flashcards
- Track your learning progress over time

## Security

- JWT-based authentication
- Secure password hashing
- Protected API endpoints
- User-specific data isolation

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenRouter for AI API access
- Meta for Llama 3.3 model
- React and FastAPI communities
- All contributors and testers

## Contact

For questions or support, please open an issue on GitHub.

---

**Built for learners everywhere**