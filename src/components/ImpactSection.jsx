import React, { useRef, useState } from "react";

const ImpactCard = ({ value, label, desc }) => {
  return (
    <div
      className="group relative rounded-lg p-4 text-center border-none shadow-lg 
                 overflow-hidden transition-all duration-500 ease-in-out
                 bg-[#0c815b] h-40 flex flex-col justify-center"
    >
      <div
        className="absolute inset-0 bg-radial-gradient from-lime-300/30 via-lime-400/10 to-transparent 
                   opacity-0 transition-all duration-500 ease-in-out 
                   scale-50 group-hover:opacity-100 group-hover:scale-125"
      />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 
                     bg-lime-300/20 rounded-full blur-3xl
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div className="relative z-10 flex flex-col justify-center items-center h-full">
        <h3
          className="text-3xl lg:text-4xl font-bold text-white 
                     transition-all duration-500 ease-in-out
                     group-hover:text-lime-300 
                     group-hover:[text-shadow:0_0_25px_theme(colors.lime.300)]
                     animate-breath group-hover:animate-none"
          style={{
            animation: "breath 2s ease-in-out infinite",
          }}
        >
          {value}
        </h3>
        <p className="text-sm font-semibold mt-2 text-lime-300 transition-colors duration-500">
          {label}
        </p>

        <div
          className="max-h-0 opacity-0 transition-all duration-500 ease-in-out 
                      group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-2"
        >
          <p className="text-xs text-gray-100">{desc}</p>
        </div>
      </div>

      {/* Add the breath animation style */}
      <style jsx>{`
        @keyframes breath {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

// A component that applies the 3D tilt effect with default tilt
const TiltImage = ({ src, alt, className }) => {
  const itemRef = useRef(null);
  // Set default tilted state (left-down tilt)
  const [transformStyle, setTransformStyle] = useState({
    transform: "rotateX(-5deg) rotateY(-5deg)",
    transformStyle: "preserve-3d",
    boxShadow: "0 30px 20px rgba(0, 0, 0, 0.3)",
  });

  const handleMouseMove = (e) => {
    const item = itemRef.current;
    if (!item) return;

    const rect = item.getBoundingClientRect();
    const positionPxX = e.clientX - rect.left;
    const positionX = (positionPxX / item.offsetWidth) * 100;

    const positionPyY = e.clientY - rect.top;
    const positionY = (positionPyY / item.offsetHeight) * 100;

    // Calculate rotation from default tilted position
    const rX = -5 + 0.5 * (50 - positionY); // Start from -5deg default
    const rY = -5 + -0.5 * (50 - positionX); // Start from -5deg default

    setTransformStyle({
      transform: `rotateX(${rX}deg) rotateY(${rY}deg)`,
      transition: "0.2s",
      transformStyle: "preserve-3d",
      perspective: "100rem",
      boxShadow: "0 30px 20px rgba(0, 0, 0, 0.3)",
    });
  };

  const handleMouseOut = () => {
    // Reset to default tilted state
    setTransformStyle({
      transform: "rotateX(0deg) rotateY(-20deg)",
      transition: "0.5s",
      transformStyle: "preserve-3d",
      boxShadow: "0 30px 20px rgba(0, 0, 0, 0.3)",
    });
  };

  return (
    <div
      ref={itemRef}
      className="w-full max-w-md sm:max-w-lg mx-auto"
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
      style={{
        transformStyle: "preserve-3d",
        perspective: "100rem",
      }}
    >
      <img
        src={src}
        alt={alt}
        className={`${className} transition-all duration-300`}
        style={{
          ...transformStyle,
          transform: transformStyle.transform,
          transformStyle: "preserve-3d",
          borderRadius: "1rem",
          boxShadow: transformStyle.boxShadow,
        }}
      />
    </div>
  );
};

export default function ImpactSection() {
  return (
    <section className=" text-white py-16 px-4 sm:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Title Section (Unchanged) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-lime-300 font-bold mb-2">Our Impact</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Through our dedicated efforts and your support, we've made
            significant progress in environmental conservation.
          </p>
          <div className="w-20 h-1 bg-lime-300 mt-4 mx-auto rounded-full" />
        </div>

        {/* Impact Cards - Now using the new ImpactCard component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-center cursor-default">
          {[
            {
              value: "7,000+",
              label: "Trees Planted",
              desc: "Local trees planted to bring back nature",
            },
            {
              value: "61+",
              label: "Tonnes Waste Recycled",
              desc: "Waste collected and reused to clean up water areas",
            },
            {
              value: "25,000+",
              label: "People Benefited",
              desc: "Helping communities with clean water and green spaces",
            },
            {
              value: "30+",
              label: "Villages Engaged",
              desc: "in projects that bring people together towards progress",
            },
          ].map((item, idx) => (
            <ImpactCard
              key={idx}
              value={item.value}
              label={item.label}
              desc={item.desc}
            />
          ))}
        </div>

        {/* Goals & Assessment (Unchanged) */}
        <div className="grid md:grid-cols-2 gap-8 rounded-xl bg-[#09503A] border border-green-700 shadow-lg p-6">
          {/* Sustainable Goals */}
          <div className="rounded-xl p-6 ">
            <h4 className="text-lg font-semibold mb-4 text-lime-300">
              Sustainable Development Goals
            </h4>
            <p className="text-sm text-gray-300 mb-4">
              Our work contributes to multiple UN Sustainable Development Goals,
              creating lasting positive change for communities and ecosystems.
            </p>
            <div className="pt-4 grid grid-cols-3 gap-y-4 gap-x-6">
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_01NoPoverty.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_02ZeroHunger.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_04QualityEducation.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_06CleanWaterSanitation.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_13Climate.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_15LifeOnLand.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
            </div>
          </div>
          <TiltImage
            src="images\goals.jpg"
            alt="Environmental Impact"
            className="w-full max-w-md sm:max-w-lg mx-auto sm:mt-20 object-contain rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
