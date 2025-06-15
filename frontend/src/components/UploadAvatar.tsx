// MyAvatar.tsx
// taken from https://mui.com/material-ui/react-avatar/ with slight modifications
import React from "react";
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import api from "../../api/axios";

const UploadAvatar = () => {
  const { user, setUser } = useAuth();

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post("/upload/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { profilePicture } = res.data;
      setUser({
        ...user!,
        profilePicture,
      });
    } catch (err) {
      console.error("Upload failed", err);
      toast.error(err + "Please refresh the page and try again.", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <ButtonBase
      component="label"
      role={undefined}
      tabIndex={-1} // prevent label from tab focus
      aria-label="Avatar image"
      sx={{
        borderRadius: "40px",
        "&:has(:focus-visible)": {
          outline: "2px solid",
          outlineOffset: "2px",
        },
      }}
    >
      <Avatar
        alt="Default"
        src={user?.profilePicture}
        sx={{
          width: "250px",
          height: "250px",
          boxShadow: "0 0 12px 2px rgba(255,255,255,0.4)",
        }}
      />
      <input
        type="file"
        accept="image/*"
        style={{
          border: 0,
          clip: "rect(0 0 0 0)",
          height: "1px",
          margin: "-1px",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          whiteSpace: "nowrap",
          width: "1px",
        }}
        onChange={handleAvatarChange}
      />
    </ButtonBase>
  );
};

export default UploadAvatar;
