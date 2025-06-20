import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../context/authContext";
import RevealOnScroll from "../components/RevealOnScroll";
import UploadAvatar from "../components/UploadAvatar";

const Profile = () => {
  const { user, setLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api
      .post("/logout")
      .then(() => {
        navigate("/");
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

  return (
    <div className="relative w-screen h-screen flex justify-end items-center overflow-hidden">
      {/* Dark overlay that sits above video only */}
      <div className="absolute top-0 left-0 w-[65%] h-full bg-black/40 z-0 pointer-events-none">
        {/* Video Background */}
        <video
          className="object-cover w-full h-full z-0"
          src="/bg-profile-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>

      {/* Profile Card */}
      {user && (
        <div className="z-10 flex flex-col justify-center items-center gap-8 w-[35%] h-screen bg-[#1a1a1a] shadow-[inset_0px_8px_64px_rgba(0,0,0,0.15),inset_0px_32px_128px_rgba(0,0,0,0.12),inset_0px_64px_256px_rgba(0,0,0,0.1),inset_0px_128px_384px_rgba(0,0,0,0.08)] text-white text-center">
          <RevealOnScroll>
            <h1 className="text-5xl font-bold mb-6">Your Profile</h1>

            <div className="flex flex-col justify-center gap-6">
              <UploadAvatar />
              <div className="flex flex-col justify-center items-center text-lg gap-4 ml-[1rem] text-white text-[20px]">
                <p>
                  Username -{" "}
                  <span className="font-bold border-white">
                    {user.username}
                  </span>
                </p>
                <p className="mb-4">
                  Email -{" "}
                  <span className="font-bold border-white">{user.email}</span>
                </p>

                <div className="flex gap-4 tx-[16px]">
                  <a href="/profile/edit">
                    <button className="bg-white text-black px-4 py-1 rounded-full hover:bg-gray-100 transition">
                      Edit
                    </button>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-black px-4 py-1 rounded-full hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>

                <p className="text-[16px] text-gray-300 mt-2">
                  Tip: Click on your profile picture to change it!
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      )}
    </div>
  );
};

export default Profile;
