import Footer from "../components/Footer";
import RevealOnScroll from "../components/RevealOnScroll";
// @/* pathing doesn't work for some reason so doing it manually to get rid of errors
import { MorphingText } from "../components/magicui/morphing-text";
import { TextReveal } from "../components/magicui/text-reveal";

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
        <p className="text-lg max-w-[800px] mx-auto mb-[60px] leading-relaxed">
          Openfloor is a debate platform designed for students and enthusiasts
          to engage in structured, meaningful argumentation. Whether you're new
          to debating or a seasoned speaker, our platform lets you challenge
          others, vote on arguments, and track your growth over time.
        </p>

        <div className="flex flex-wrap justify-center gap-10">
          <div className="bg-[#e3e3e3] text-left p-8 w-[280px] rounded-xl shadow-[rgba(0,0,0,0.17)_0px_-23px_25px_0px_inset,rgba(0,0,0,0.15)_0px_-36px_30px_0px_inset,rgba(0,0,0,0.1)_0px_-79px_40px_0px_inset,rgba(0,0,0,0.06)_0px_2px_1px,rgba(0,0,0,0.09)_0px_4px_2px,rgba(0,0,0,0.09)_0px_8px_4px,rgba(0,0,0,0.09)_0px_16px_8px,rgba(0,0,0,0.09)_0px_32px_16px] transition-all hover:animate-[jump_0.5s_ease-in-out]">
            <h3 className="text-[20px] text-[#3e3e3e] font-semibold mb-4">
              Public & Private Debates
            </h3>
            <p className="text-sm text-[#3e3e3e]">
              Engage in structured debates against other users in real-time.
              Create a debate, choose a topic, and establish stances to support.
            </p>
          </div>

          <div className="bg-[#e3e3e3] text-left p-8 w-[280px] rounded-xl shadow-[rgba(0,0,0,0.17)_0px_-23px_25px_0px_inset,rgba(0,0,0,0.15)_0px_-36px_30px_0px_inset,rgba(0,0,0,0.1)_0px_-79px_40px_0px_inset,rgba(0,0,0,0.06)_0px_2px_1px,rgba(0,0,0,0.09)_0px_4px_2px,rgba(0,0,0,0.09)_0px_8px_4px,rgba(0,0,0,0.09)_0px_16px_8px,rgba(0,0,0,0.09)_0px_32px_16px] transition-all hover:animate-[jump_0.5s_ease-in-out]">
            <h3 className="text-[20px] text-[#3e3e3e] font-semibold mb-4">
              Community Voting
            </h3>
            <p className="text-sm text-[#3e3e3e]">
              Let the community decide the winner based on reasoning strength.
            </p>
          </div>

          <div className="bg-[#e3e3e3] text-left p-8 w-[280px] rounded-xl shadow-[rgba(0,0,0,0.17)_0px_-23px_25px_0px_inset,rgba(0,0,0,0.15)_0px_-36px_30px_0px_inset,rgba(0,0,0,0.1)_0px_-79px_40px_0px_inset,rgba(0,0,0,0.06)_0px_2px_1px,rgba(0,0,0,0.09)_0px_4px_2px,rgba(0,0,0,0.09)_0px_8px_4px,rgba(0,0,0,0.09)_0px_16px_8px,rgba(0,0,0,0.09)_0px_32px_16px] transition-all hover:animate-[jump_0.5s_ease-in-out]">
            <h3 className="text-[20px] text-[#3e3e3e] font-semibold mb-4">
              Skill Progression
            </h3>
            <p className="text-sm text-[#3e3e3e]">
              Earn ranks, track stats, and build your debate resume.
            </p>
          </div>
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
