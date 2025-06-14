// home.tsx
import "../styles/home.css";

const Home = () => {
  return (
    <div className="page-container">
      <video src="/background.mp4" autoPlay loop muted></video>
      <div className="home-container">
        <h1>Openfloor</h1>
        <div>
          <h3>Welcome debators</h3>
          <p>
            Openfloor is a free online platform designed to foster thoughtful
            debate, encourage civil discourse, and develop persuasive
            communication skills.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
