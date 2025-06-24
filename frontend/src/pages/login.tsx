// pages/login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import RevealOnScroll from "../components/RevealOnScroll";
import api from "../../api/axios";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.error(location.state.message, {
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
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });
      if (response.status === 200) {
        setLoggedIn(true);
        setUser(response.data.user);
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message } = error.response!.data as { message: string };
        setErrorMessage(message);
      }
    }
  };

  return (
    <div className="flex justify-end items-center w-screen h-screen relative overflow-hidden">
      {/* Video background */}
      <div className="absolute top-0 left-0 w-[65%] h-full -z-[-1]">
        <video
          src="/bg-login.mp4"
          autoPlay
          loop
          muted
          preload="auto"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Form section */}
      <div className="p-6 w-[35%] h-full flex flex-col justify-center items-center bg-[#1a1a1a] shadow-[inset_0px_8px_64px_rgba(0,0,0,0.15),inset_0px_32px_128px_rgba(0,0,0,0.12),inset_0px_64px_256px_rgba(0,0,0,0.1),inset_0px_128px_384px_rgba(0,0,0,0.08)]">
        <RevealOnScroll>
          <h1 className="text-white text-5xl font-semibold mb-10">
            Glad to have you back.
          </h1>
          <form
            onSubmit={handleLogin}
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
              Login
            </button>
          </form>
          <p className="text-white mt-6 text-[16px]">
            Don't have an account?{" "}
            <a href="/register" className="underline hover:text-indigo-400">
              Create one now!
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

export default Login;
