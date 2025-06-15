// edit.tsx
import React, { useState } from "react";
import RevealOnScroll from "../components/RevealOnScroll";
import { useAuth } from "../context/authContext";
import "../styles/loginRegister.css";

const Edit = () => {
  const { user } = useAuth();
  const [newUsername, setNewUsername] = useState<string>(user!.username);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPwd, setConfirmNewPwd] = useState<string>("");

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("got here");
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
                placeholder="Username*"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                id="edit-password"
                className="input-line"
                placeholder="New Password*"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                id="edit-confirm-password"
                className="input-line"
                placeholder="Confirm New Password*"
                required
                value={confirmNewPwd}
                onChange={(e) => setConfirmNewPwd(e.target.value)}
              />
            </div>
            <button type="submit">Save</button>
          </form>
          <p className="cl-account" style={{ margin: "1rem 5rem" }}>
            Tip: You may use the same password if you only want to change your
            username!
          </p>
        </RevealOnScroll>
      </div>
    </div>
  );
};

export default Edit;
