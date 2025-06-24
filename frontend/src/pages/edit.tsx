// pages/edit.tsx
import React, { useState } from "react";
import RevealOnScroll from "../components/RevealOnScroll";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import axios from "axios";

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
    <div className="flex justify-end items-center w-screen h-screen">
      <div className="absolute top-0 left-0 w-full h-full -z-[-1]">
        <video
          className="w-full h-full object-cover"
          src="/bg-edit.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>

      <div className="p-6 z-[10] w-[35%] h-full flex flex-col justify-center items-center bg-[#1a1a1a] shadow-[inset_0_8px_64px_rgba(0,0,0,0.15),inset_0_32px_128px_rgba(0,0,0,0.12),inset_0_64px_256px_rgba(0,0,0,0.10),inset_0_128px_384px_rgba(0,0,0,0.08)]">
        <RevealOnScroll>
          <h1 className="mb-10 text-white text-5xl font-bold text-center px-4">
            What would you like to change?
          </h1>
          <form
            onSubmit={handleEdit}
            className="flex flex-col items-center w-full"
          >
            <div className="flex justify-center items-center w-full">
              <input
                type="text"
                id="edit-username"
                className="bg-transparent w-1/2 border-b border-white py-3 px-2 mb-5 text-white text-base outline-none focus:border-[#646cff]"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <input
                type="password"
                id="edit-password"
                className="bg-transparent w-1/2 border-b border-white py-3 px-2 mb-5 text-white text-base outline-none focus:border-[#646cff]"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <input
                type="password"
                id="edit-confirm-password"
                className="bg-transparent w-1/2 border-b border-white py-3 px-2 mb-5 text-white text-base outline-none focus:border-[#646cff]"
                placeholder="Confirm New Password"
                value={confirmNewPwd}
                onChange={(e) => setConfirmNewPwd(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="text-black mt-4 py-2 px-7 bg-white rounded-full cursor-pointer hover:bg-[#f0f0f0]"
            >
              Save
            </button>
          </form>
          <p className="text-white text-[16px] text-center mt-5 px-10">
            Tip: You may leave the passwords blank if you only want to change
            your username!
          </p>
        </RevealOnScroll>
      </div>
    </div>
  );
};

export default Edit;
