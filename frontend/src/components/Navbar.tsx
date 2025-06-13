// Navbar.tsx
import { useAuth } from "../context/authContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { loggedIn } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/" id="temp-logo">
          Openfloor
        </a>
      </div>
      <div className="navbar-links">
        {!loggedIn ? (
          <>
            <div>
              <a href="/login">Login</a>
            </div>
            <div>
              <a href="/register">Register</a>
            </div>
          </>
        ) : (
          <div>
            <a href="/profile">Profile</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
