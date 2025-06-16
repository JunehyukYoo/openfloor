// Navbar.tsx
import { useAuth } from "../context/authContext";
import Avatar from "@mui/material/Avatar";
import "../styles/Navbar.css";

const Navbar = () => {
  const { loggedIn, user } = useAuth();
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
              <a href="/login">Login</a>
            </div>
            <div>
              <a href="/register">Register</a>
            </div>
          </>
        ) : (
          <>
            <div>
              <a href="/dashboard/topics">Debate Dashboard</a>
            </div>
            <div>
              {user ? (
                <div className="prof-pic">
                  <a href="/profile">
                    <Avatar src={user.profilePicture} alt={user.username} />
                  </a>
                </div>
              ) : (
                <div>null</div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
