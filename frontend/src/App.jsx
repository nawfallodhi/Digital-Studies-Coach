import AIChat from "./AIChat";
import Navbar from "./Navbar";
import Home from "./pages/home";
import Quizes from "./pages/quizes";
import About from "./pages/about";
import History from "./pages/history"
import Flash from "./pages/flashcards"
import Courses from "./pages/courses"
import Login from "./pages/login";
import Register from "./pages/register";

import { Routes, Route, Navigate} from "react-router";
import "katex/dist/katex.min.css";

const ProtectedRoute = ({children}) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />
};

function App() {
  return (
    <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/quizes" element={<Quizes/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/history" element={<ProtectedRoute><History/></ProtectedRoute>}/>
          <Route path="/flashcards" element={<Flash/>}/>
          <Route path="/courses" element={<Courses/>}/>
          <Route path="/discuss" element={<AIChat/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
    </div>
  );
}

export default App;