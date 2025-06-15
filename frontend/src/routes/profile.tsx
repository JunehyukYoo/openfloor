// profile.tsx
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../context/authContext";
import RevealOnScroll from "../components/RevealOnScroll";
import UploadAvatar from "../components/UploadAvatar";
import "../styles/profile.css";

const Profile = () => {
  const { user, setLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api
      .post("/logout")
      .then(() => {
        navigate("/");
        /*
          Timeout here because otherwise application will 
          still be on route /profile but see that user is not
          logged in and immediately redirect to /login and
          display a banner.
        */
        setTimeout(() => {
          setLoggedIn(false);
          setUser(null);
        }, 10);
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
      });
  };

  const bgVid = new URL(
    "/bg-videos/bg-profile.mp4",
    import.meta.env.VITE_CDN_DOMAIN
  ).toString();
  console.log(bgVid);

  return (
    <div className="page-container">
      <div className="video-container">
        <video src={bgVid} autoPlay loop muted preload="auto"></video>
      </div>
      <RevealOnScroll>
        <div className="profile-container">
          {user ? (
            <>
              <h1>Welcome {user.username}!</h1>
              <div className="profile-inner-container">
                <UploadAvatar />
                <div className="profile-details">
                  <p>
                    Username - <span>{user.username}</span>
                  </p>
                  <p style={{ marginBottom: "1rem" }}>
                    Email - <span>{user.email}</span>
                  </p>
                  <div className="profile-buttons">
                    <button>Modify</button>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                  <p className="tips">
                    Tip: Click on your profile picture to change it!
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div></div>
          )}
        </div>
      </RevealOnScroll>
    </div>
  );
};
export default Profile;
