// MyAvatar.tsx
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../context/authContext";
import "../styles/MyAvatar.css";

const MyAvatar = () => {
  const { user } = useAuth();
  return (
    <>
      {user ? (
        <div className="prof-pic">
          <a href="/profile">
            <Avatar src={user.profilePicture} alt={user.username} />
          </a>
        </div>
      ) : (
        <div>null</div>
      )}
    </>
  );
};

export default MyAvatar;
