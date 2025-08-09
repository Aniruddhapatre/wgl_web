import React from "react";
import { Heart, PackageSearch, FlaskConical, Users } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: <Heart className="text-lime-400 w-6 h-6" />,
      title: "Compassion",
      description: "We care deeply about our planet and all its inhabitants.",
      border: "border-lime-500",
    },
    {
      icon: <PackageSearch className="text-cyan-400 w-6 h-6" />,
      title: "Innovation",
      description: "We find creative solutions to environmental challenges.",
      border: "border-cyan-400",
    },
    {
      icon: <FlaskConical className="text-yellow-400 w-6 h-6" />,
      title: "Sustainability",
      description: "We create long-lasting positive environmental impact.",
      border: "border-yellow-400",
    },
    {
      icon: <Users className="text-purple-400 w-6 h-6" />,
      title: "Community",
      description: "We empower local communities to be environmental stewards.",
      border: "border-purple-400",
    },
  ];

  return (
    <section className="text-white px-4 sm:px-16 py-16 ">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-lime-300">
            About World Green Line
          </h2>

          <div className="h-1 w-24 bg-lime-400 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-10">
          {/* Mission & Vision with custom border effect */}
          <div className="relative group transition-all duration-500">
            {/* Right & Bottom Border Effect */}
            <div
              className="absolute -right-1 sm:-right-2 -bottom-1 sm:-bottom-2 w-full h-full bg-green-600 rounded-xl z-0 
                  opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500"
            />

            {/* Main Box */}
            <div
              className="relative z-10 bg-[#09523A] p-4 sm:p-10 h-full rounded-xl shadow-lg border border-green-600 
                  text-sm sm:text-base leading-relaxed transition-all duration-500"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-lime-400 sm:mb-4">
                Our Mission
              </h3>
              <p className="text-gray-200 mb-4 ">
                World Green Line is dedicated to creating a sustainable future
                through environmental conservation, community engagement, and
                education. We believe in the power of collective action to
                restore our planet's natural resources.
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold text-lime-400 sm:mb-4">
                Our Vision
              </h3>
              <p className="text-gray-200">
                A world where communities thrive in harmony with nature, where
                forests flourish, water sources remain clean, and future
                generations inherit a healthy planet.
              </p>
            </div>
          </div>

          {/* Values Cards */}
          {/* <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-[#09523A] p-5 sm:p-6 rounded-lg shadow-md border-l-4 ${value.border} hover:scale-[1.03] transition-transform duration-300`}
              >
                <div className="mb-3">{value.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-1">
                  {value.title}
                </h4>
                <p className="text-sm text-gray-300">{value.description}</p>
              </div>
            ))}
          </div> */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-[#09523A] p-4 sm:p-6 rounded-lg shadow-md border-l-4 ${value.border} hover:scale-[1.03] transition-transform duration-300`}
              >
                {/* Icon + Title: horizontal on mobile, vertical on sm+ */}
                <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 mb-2">
                  {value.icon}
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
    </section>
  );
};

export default AboutSection;
