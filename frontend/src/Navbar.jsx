import './Navbar.css'
import { Link, useNavigate,} from "react-router";

const Navbar = () => {

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // if(!token) {
    //     navigate("/login");
    //     return null; 
    // }

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
                        <Link to="/about">About</Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-right">
                {isLoggedIn ? (<button onClick={handleLogout} className='logout-btn'>Sign Out</button>): (<Link to="/login">Login</Link>)};  
            </div>
        </nav>
    );
};

export default Navbar;