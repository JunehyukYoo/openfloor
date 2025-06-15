// edit.tsx
import React, { useState } from "react";
import RevealOnScroll from "../components/RevealOnScroll";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import axios from "axios";
import "../styles/loginRegister.css";

const Edit = () => {
  const { user, setUser } = useAuth();
  const [newUsername, setNewUsername] = useState<string>(user!.username);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPwd, setConfirmNewPwd] = useState<string>("");
  const navigate = useNavigate();

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword != confirmNewPwd) {
      toast.error("Your passwords do not match.", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (newPassword.trim() === "" && newUsername === user!.username) {
      toast.error("Nothing was changed...", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      const response = await api.put("/profile/edit", {
        username: newUsername,
        newPassword: newPassword.trim() !== "" ? newPassword : undefined, // don't send empty password
      });

      toast.success("Your profile has been updated!", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
      });

      setNewPassword("");
      setConfirmNewPwd("");
      navigate("/profile");
      setUser(response.data.user);
    } catch (error) {
      console.error("Edit failed:", error);
      if (axios.isAxiosError(error)) {
        const { message } = error.response!.data as {
          message: string;
        };
        toast.error(message || "Failed to update profile.", {
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
    }
  };

  return (
    <div className="lr-container">
      <div className="video-container">
        <video src="/bg-edit.mp4" autoPlay loop muted preload="auto"></video>
      </div>

      <div className="form-container">
        <RevealOnScroll>
          <h1>What would you like to change?</h1>
          <form onSubmit={handleEdit} id="login-form">
            <div className="input-container">
              <input
                type="text"
                id="edit-username"
                className="input-line"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                id="edit-password"
                className="input-line"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                id="edit-confirm-password"
                className="input-line"
                placeholder="Confirm New Password"
                value={confirmNewPwd}
                onChange={(e) => setConfirmNewPwd(e.target.value)}
              />
            </div>
            <button type="submit">Save</button>
          </form>
          <p className="cl-account" style={{ margin: "1rem 5rem" }}>
            Tip: You may leave the passwords blank if you only want to change
            your username!
          </p>
        </RevealOnScroll>
      </div>
    </div>
  );
};

export default Edit;
