import './Navbar.css'
import { Link } from "react-router";

const Navbar = () => {
    return(
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/">Digital Studies Coach</Link>
            </div>
            <div className="navbar-center">
                <ul className="nav-links">
                    <li>
                        <Link to="/discuss">Concept Reinforcer</Link>
                    </li>
                    <li>
                        <Link to="/history">Request History</Link>
                    </li>
                    <li>
                        <Link to="/courses">Courses</Link>
                    </li>
                    <li>
                        <Link to="/flashcards">Flashcards</Link>
                    </li>
                    <li>
                        <Link to="/quizes">Practice Tests</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                    <li>
                        <Link to="/about">About Us</Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-right">
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;