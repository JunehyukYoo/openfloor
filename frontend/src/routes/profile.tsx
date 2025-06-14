// profile.tsx
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../context/authContext";

const Profile = () => {
  const { user, setLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api
      .post("/logout")
      .then(() => {
        setLoggedIn(false);
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
      });
  };

  return (
    <div className="page-container">
      <h1>Profile</h1>
      <h3>Welcome {user ? user.username : null}!</h3>
      <p>This is the profile page.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
export default Profile;
