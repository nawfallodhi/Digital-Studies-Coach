import AIChat from "./AIChat";
import Navbar from "./Navbar";
import Home from "./pages/home";
import Quizes from "./pages/quizes";
import About from "./pages/about";
import History from "./pages/history"
import Flash from "./pages/flashcards"
import Courses from "./pages/courses"
import Contact from "./pages/contact"
import Login from "./pages/login";
import Register from "./pages/register";

import { MathJaxContext } from "better-react-mathjax";
import { Routes, Route} from "react-router";
import "katex/dist/katex.min.css";

function App() {
  return (
    <div>
      <MathJaxContext>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/quizes" element={<Quizes/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/flashcards" element={<Flash/>}/>
          <Route path="/courses" element={<Courses/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/discuss" element={<AIChat/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </MathJaxContext>
    </div>
  );
}

export default App;