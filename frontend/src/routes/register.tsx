import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RevealOnScroll from "../components/RevealOnScroll";
import api from "../../api/axios";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const { data } = await api.post("/register", {
        email,
        password,
        username,
      });
      console.log("Register successful:", data);
      navigate("/");
      toast.success("Registration successful! You can now log in.", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const serverMsg = error.response?.data?.message as string | undefined;

        if (status === 400) {
          setErrorMessage(serverMsg ?? "That email is already registered.");
        } else if (status === 409) {
          setErrorMessage(serverMsg ?? "That username is already taken.");
        } else {
          setErrorMessage(
            serverMsg ?? "Registration failed. Please try again later."
          );
        }
      } else {
        console.error(error);
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="relative w-screen h-screen flex justify-end items-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute top-0 left-0 w-[65%] h-full -z-[-1]">
        <video
          src="/bg-register.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form container */}
      <div className="p-6 w-[35%] h-full flex flex-col justify-center items-center bg-[#1a1a1a] shadow-[inset_0px_8px_64px_rgba(0,0,0,0.15),inset_0px_32px_128px_rgba(0,0,0,0.12),inset_0px_64px_256px_rgba(0,0,0,0.1),inset_0px_128px_384px_rgba(0,0,0,0.08)]">
        <RevealOnScroll>
          <h1 className="text-white text-5xl font-semibold mb-10">
            You're making a great decision.
          </h1>
          <form
            onSubmit={handleRegister}
            className="flex flex-col items-center w-full"
          >
            <div className="flex justify-center items-center w-full">
              <input
                type="email"
                placeholder="Email*"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-1/2 bg-transparent border-b border-white text-white text-base py-3 px-2 mb-5 outline-none placeholder:text-gray-400 focus:border-b-2 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <input
                type="text"
                placeholder="Username*"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-1/2 bg-transparent border-b border-white text-white text-base py-3 px-2 mb-5 outline-none placeholder:text-gray-400 focus:border-b-2 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <input
                type="password"
                placeholder="Password*"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-1/2 bg-transparent border-b border-white text-white text-base py-3 px-2 mb-5 outline-none placeholder:text-gray-400 focus:border-b-2 focus:border-indigo-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition"
            >
              Register
            </button>
          </form>

          <p className="text-white mt-6">
            Already have an account?{" "}
            <a href="/login" className="underline hover:text-indigo-400">
              Log in here!
            </a>
          </p>
        </RevealOnScroll>

        {errorMessage && (
          <div className="text-red-500 mt-4">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
