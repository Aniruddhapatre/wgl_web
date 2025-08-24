import bgImage from "/images/img4.avif";
import { useNavigate, useLocation } from "react-router-dom";

const useVideo = true; //Change this to false to show image instead of video

const HomeSection = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="w-full h-screen relative overflow-hidden">
      {/* Background */}
      {useVideo ? (
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="https://res.cloudinary.com/dpsbx8enu/video/upload/v1754653988/riverraft2_lv90sh.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src={bgImage}
          alt="Background"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center top-28 items-start text-left text-white px-6 md:px-32 ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold sm:mb-4 drop-shadow-lg">
          From River Streams to Vast Forests, <br /> We make a change
        </h1>
        <p className="text-base sm:text-lg lg:text-xl max-w-2xl">
          Join us in building a sustainable future through innovation and
          community action. Let’s protect our planet for future generations.
        </p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/InternshipPage")}
            className="relative inline-block group sm:px-6 sm:py-4 px-2  font-semibold sm:rounded-2xl rounded-xl text-base sm:text-lg border border-green-700 bg-gradient-to-r from-green-500 to-green-600 shadow-lg overflow-hidden"
          >
            <span className="relative z-10 text-white tracking-wide transition-colors duration-300 group-hover:text-green-800">
              Join Our Team
            </span>
            <span className="absolute inset-0 bg-white translate-y-full rounded-full transition-all duration-500 group-hover:translate-y-0 group-hover:rounded-none z-0" />
          </button>

          {/* Donate Us Button */}
          <button
            onClick={() => navigate("/donate")}
            className="relative inline-block group font-semibold sm:px-6 px-2 py-4 sm:rounded-2xl rounded-xl text-base sm:text-lg border border-green-700 bg-gradient-to-r from-green-500 to-green-600 shadow-lg overflow-hidden"
          >
            <span className="relative z-10 text-white tracking-wide transition-colors duration-300 group-hover:text-green-800">
              Donate Us
            </span>
            <span className="absolute inset-0 bg-white translate-y-full rounded-full transition-all duration-500 group-hover:translate-y-0 group-hover:rounded-none z-0" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
