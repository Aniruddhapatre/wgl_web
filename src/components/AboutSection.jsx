import React from "react";
import { Heart, PackageSearch, FlaskConical, Users } from "lucide-react";
// funcanality is done just add color
const AboutSection = () => {
const values = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Compassion",
    description: "We care deeply for mother earth and all living beings",
    cardClass: "border-l-4 border-lime-500 hover:border-lime-200 transition-colors duration-200",
    iconClass: "text-lime-500 group-hover:text-lime-200 transition-colors duration-200",
  },
  {
    icon: <PackageSearch className="w-6 h-6" />,
    title: "Innovation",
    description: "We share innovative ideas on environamental conservation",
    cardClass: "border-l-4 border-cyan-500 hover:border-cyan-200 transition-colors duration-200",
    iconClass: "text-cyan-500 group-hover:text-cyan-200 transition-colors duration-200",
  },
  {
    icon: <FlaskConical className="w-6 h-6" />,
    title: "Sustainability",
    description: "We work on sustainable solutions that help protect nature.",
    cardClass: "border-l-4 border-yellow-500 hover:border-yellow-200 transition-colors duration-200",
    iconClass: "text-yellow-500 group-hover:text-yellow-200 transition-colors duration-200",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community",
    description: "We empower local communities to be environmental stewards.",
    cardClass: "border-l-4 border-purple-500 hover:border-purple-200 transition-colors duration-200",
    iconClass: "text-purple-500 group-hover:text-purple-200 transition-colors duration-200",
  },
];


  return (
    <section className="relative text-white px-4 sm:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-lime-300">
            About World Green Line
          </h2>
          <div className="h-1 w-24 bg-lime-400 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          {/* Mission & Vision Card */}
          <div className="relative group">
            <div className="absolute -right-1 sm:-right-2 -bottom-1 sm:-bottom-2 w-full h-full bg-gradient-to-br from-[#146434] to-[#21d368] rounded-xl opacity-0 scale-95 group-hover:opacity-30 group-hover:scale-100 transition-all duration-500 blur-md"></div>

            <div className="relative z-10 bg-[#09513A] p-5 sm:p-10 h-full rounded-xl shadow-sm border border-green-600 transition-all duration-500">
              <h3 className="text-xl sm:text-2xl font-semibold text-lime-400 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-200 mb-6">
               To be the leading NGO, bringing together society, government, and businesses to protect the environment, overcoming all challenges and preserving nature’s balance.
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold text-lime-400 mb-4">
                What we do
              </h3>
              <p className="text-gray-200">
                World green Line aims to promote environmental conservation by educating the society on their responsibilities towards nature through ongoing initiatives like afforestation, waste management, water body conservation, innovative agriculture, and optimal use of natural resources.
              </p>
            </div>
          </div>

          {/* Values Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`group relative bg-[#09513A] rounded-lg p-4 sm:p-6 h-full shadow-md transition-all duration-300 ${value.cardClass} cursor-default`}
              >
                {/* Icon + Title */}
                <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 mb-2">
                  <div
                    className={`${value.iconClass} animate-[float_3s_ease-in-out_infinite] transition-colors duration-300`}
                  >
                    {value.icon}
                  </div>
                  <h4 className="text-base font-semibold text-white">
                    {value.title}
                  </h4>
                </div>
                {/* Description */}
                <p className="text-sm sm:text-base text-gray-200">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind custom animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
        `}
      </style>
    </section>
  );
};

export default AboutSection;
