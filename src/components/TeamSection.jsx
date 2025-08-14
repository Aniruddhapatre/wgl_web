import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

// --- Data (Unchanged) ---
const teamData = [
  {
    name: "Dr. Ananya Sharma",
    title: "Executive Director",
    field: "Leadership",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Environmental scientist with 15+ years of experience in conservation and sustainable development.",
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Rajiv Mehta",
    title: "Operations Director",
    field: "Management",
    image: "https://plus.unsplash.com/premium_photo-1664536392779-049ba8fde933?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Former corporate executive who transitioned to environmental work with expertise in project management.",
    socials: { linkedin: "#", facebook: "#" },
  },
  {
    name: "Priya Verma",
    title: "Design Lead",
    field: "Design",
    image: "https://images.unsplash.com/photo-1556575533-7190b053c299?q=80&w=377&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "UX/UI designer passionate about eco-friendly digital products and inclusive design.",
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Amit Rathi",
    title: "HR Manager",
    field: "HR",
    image: "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "HR expert focused on team well-being, diversity and engagement in sustainability projects.",
    socials: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Nisha Kapoor",
    title: "Environmental Analyst",
    field: "Research",
    image: "https://images.unsplash.com/photo-1577008491687-618784e40949?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Data-driven researcher working on environmental impact models and green policy evaluation.",
    socials: { linkedin: "#" },
  },
  {
    name: "Sameer Joshi",
    title: "Field Operations Officer",
    field: "Management",
    image: "https://images.unsplash.com/photo-1634148969837-7feba3939ee3?q=80&w=460&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Coordinates on-ground environmental clean-up and awareness campaigns across urban areas.",
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Sanya Bhatia",
    title: "Community Engagement Head",
    field: "Leadership",
    image: "https://images.unsplash.com/photo-1637009981125-89e30d29a627?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    description: "Expert in building community outreach programs and facilitating grassroots climate action.",
    socials: { linkedin: "#", facebook: "#" },
  },
];

const fields = ["All", "Leadership", "Management", "Design", "HR", "Research"];

// --- Social Icon Component ---
const SocialIcon = ({ href, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-lime-300 transition-colors duration-300"
  >
    <Icon size={20} />
  </a>
);

// --- Team Card Component ---
const TeamCard = ({ member }) => (
    <div className="relative group w-[300px] h-[400px] rounded-2xl overflow-hidden shadow-lg">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 text-left w-full transition-all duration-500 ease-in-out transform translate-y-1/4 group-hover:translate-y-0">
        <h4 className="text-2xl font-bold text-white mb-1">{member.name}</h4>
        <p className="text-lime-400 text-sm font-medium mb-3">{member.title}</p>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-h-0 group-hover:max-h-40">
           <p className="text-gray-300 text-sm mb-4">
            {member.description}
          </p>
          <div className="flex items-center gap-4 border-t border-gray-600 pt-3">
            {member.socials.linkedin && <SocialIcon href={member.socials.linkedin} icon={Linkedin} />}
            {member.socials.twitter && <SocialIcon href={member.socials.twitter} icon={Twitter} />}
            {member.socials.facebook && <SocialIcon href={member.socials.facebook} icon={Facebook} />}
            {member.socials.instagram && <SocialIcon href={member.socials.instagram} icon={Instagram} />}
          </div>
        </div>
      </div>
    </div>
);

// --- Main Team Section Component ---
const TeamSection = () => {
  const [selectedField, setSelectedField] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredTeam =
    selectedField === "All"
      ? teamData
      : teamData.filter((member) => member.field === selectedField);
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedField]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredTeam.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === filteredTeam.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="relative  text-lime-300 py-16 sm:py-24 px-4 overflow-hidden">
        {/* Subtle background pattern */}
        <div 
            className="absolute inset-0 opacity-5" >
        </div>
      
      {/* Content Wrapper */}
      <div className="relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white">Our Team</h2>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Meet the dedicated professionals working tirelessly to make our
              environmental vision a reality.
            </p>
            <div className="h-1 w-20 bg-lime-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Filter Buttons
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-12">
            {fields.map((field) => (
              <button
                key={field}
                onClick={() => setSelectedField(field)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  selectedField === field
                    ? 'bg-lime-400 text-gray-900 border-lime-400'
                    : 'bg-transparent text-white border-lime-600 hover:bg-lime-300/20 hover:border-lime-400'
                }`}
              >
                {field}
              </button>
            ))}
          </div> */}

          {/* Custom Carousel */}
          <div className="relative max-w-7xl mx-auto h-[450px] flex items-center justify-center">
            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute  left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
              disabled={filteredTeam.length <= 1}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
              disabled={filteredTeam.length <= 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Carousel Track */}
            <div className="relative w-full h-full">
                {filteredTeam.map((member, index) => {
                    const n = filteredTeam.length;
                    let offset = index - currentIndex;

                    // This logic creates a circular effect
                    if (n > 2) {
                        if (offset > n / 2) {
                            offset -= n;
                        }
                        if (offset < -n / 2) {
                            offset += n;
                        }
                    }
                    
                    // To optimize, we only render a few slides around the current one
                    if (Math.abs(offset) > 2) return null;

                    const style = {
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        // Cards are now closer together (250px instead of 320px)
                        transform: `translateX(-50%) translateX(${offset * 250}px) scale(${1 - Math.abs(offset) * 0.15})`,
                        opacity: 1 - Math.abs(offset) * 0.3,
                        zIndex: 10 - Math.abs(offset),
                        transition: 'all 0.4s ease-in-out',
                    };
                    
                    return (
                        <div key={`${selectedField}-${index}`} style={style}>
                            <TeamCard member={member} />
                        </div>
                    );
                })}
            </div>
          </div>
      </div>
    </section>
  );
};

export default TeamSection;
