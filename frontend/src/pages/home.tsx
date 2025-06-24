// pages/home.tsx
import Footer from "../components/Footer";
import RevealOnScroll from "../components/RevealOnScroll";
// @/* pathing doesn't work for some reason so doing it manually to get rid of errors
import { MorphingText } from "../components/magicui/morphing-text";
import { TextReveal } from "../components/magicui/text-reveal";
import { FeatureGrid } from "../components/FeatureGrid";
import { TextAnimate } from "../components/magicui/text-animate";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video + dark filter wrapper */}
      <div className="absolute top-0 left-0 h-full w-full z-[1] brightness-[0.4]">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/bg-home-compressed.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="relative z-10 text-white px-[10%] pt-[20vh] text-center">
        <RevealOnScroll>
          <div className="translate-y-38">
            <h1 className="text-[150px] font-[300] mb-2 leading-none">
              Openfloor.
            </h1>
            <div className="flex justify-center">
              <MorphingText
                className="first:text-[50px] font-light"
                texts={["Debaters", "Thinkers", "Philosophers", "Enthusiasts"]}
              />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

const Quote = () => {
  return (
    <section className="bg-linear-to-b from-black to-[#1a1a1a] text-center px-8 py-24">
      <TextReveal className="[&_span]:text-5xl  [&_span]:font-light [&_span]:text-[#e3e3e3]">
        “We can easily forgive a child who is afraid of the dark; the real
        tragedy of life is when men are afraid of the light.” - Plato
      </TextReveal>
    </section>
  );
};

const Info = () => {
  return (
    <section className="bg-[#1a1a1a] text-[#e3e3e3] text-center px-[10%] py-[100px]">
      <RevealOnScroll>
        <h2 className="text-[36px] mb-8 font-semibold">What is Openfloor?</h2>
        <TextAnimate
          animation="blurInUp"
          by="word"
          className="text-lg max-w-[800px] mx-auto mb-[80px] leading-relaxed"
          once
        >
          Openfloor is a debate platform designed for students and enthusiasts
          to engage in structured, meaningful argumentation. Whether you're new
          to debating or a seasoned speaker, our platform lets you challenge
          others, vote on arguments, and track your growth over time.
        </TextAnimate>

        <div className="flex flex-wrap justify-center gap-10">
          <FeatureGrid />
        </div>
      </RevealOnScroll>
    </section>
  );
};

const Home = () => {
  return (
    <div className="w-screen min-h-screen">
      <Hero />
      <Quote />
      <Info />
      <Footer />
    </div>
  );
};

export default Home;
