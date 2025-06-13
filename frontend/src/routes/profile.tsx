// profile.tsx
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../context/authContext";

const Profile = () => {
  const { username, setLoggedIn, setUsername } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api
      .post("/logout")
      .then(() => {
        setLoggedIn(false);
        setUsername("");
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
      <h3>Welcome {username}!</h3>
      <p>This is the profile page.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
export default Profile;
