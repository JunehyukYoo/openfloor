// Navbar.tsx
import { useAuth } from "../context/authContext";
import MyAvatar from "./MyAvatar";
import "../styles/Navbar.css";

const Navbar = () => {
  const { loggedIn } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/" id="temp-logo">
          Openfloor.
        </a>
      </div>
      <div className="navbar-links">
        {!loggedIn ? (
          <>
            <div>
              <a href="/public-debates">Public Debates</a>
            </div>
            <div>
              <a href="/login">Login</a>
            </div>
            <div>
              <a href="/register">Register</a>
            </div>
          </>
        ) : (
          <>
            <div>
              <a href="/debates/public">Public Debates</a>
            </div>
            <div>
              <a href="/debates/private">My Debates</a>
            </div>
            <div>
              <MyAvatar />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
