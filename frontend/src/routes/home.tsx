// home.tsx
import Footer from "../components/Footer";
import RevealOnScroll from "../components/RevealOnScroll";
import "../styles/home.css";

const Hero = () => {
  return (
    <section className="hero">
      <video
        className="hero-video"
        src="/background.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>

      <div className="hero-content">
        <h1>Openfloor.</h1>
        <h3>We welcome all: debaters, philosophers, and thinkers alike.</h3>
      </div>
    </section>
  );
};

const Info = () => {
  return (
    <section className="info-section">
      <h2>What is Openfloor?</h2>
      <p>
        Openfloor is a debate platform designed for students and enthusiasts to
        engage in structured, meaningful argumentation. Whether you're new to
        debating or a seasoned speaker, our platform lets you challenge others,
        vote on arguments, and track your growth over time.
      </p>

      <div className="features">
        <div className="feature-card">
          <h3>Public & Private Debates</h3>
          <p>
            Engage in structured debates against other users in real-time.
            Create a debate, choose a topic, and establish stances to support.
          </p>
        </div>
        <div className="feature-card">
          <h3>Community Voting</h3>
          <p>
            Let the community decide the winner based on reasoning strength.
          </p>
        </div>
        <div className="feature-card">
          <h3>Skill Progression</h3>
          <p>Earn ranks, track stats, and build your debate resume.</p>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="home-container">
      <RevealOnScroll>
        <Hero />
      </RevealOnScroll>
      <RevealOnScroll>
        <Info />
      </RevealOnScroll>
      <Footer />
    </div>
  );
};

export default Home;
