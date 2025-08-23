import { useState } from "react";
import ParticleBackground from "./ParticleBackground";

// --- Data ---
const teamData = [
  {
    name: "Pritiranjan Dash",
    title: "Founder & President",
    field: "Leadership",
    image: "https://www.worldgreenline.org/images/team1.jpg",
    description:
      "Visionary leader and social entrepreneur, committed to driving impactful change through innovative community projects.",
  },
  {
    name: "Vishal Kumar",
    title: "Vice President",
    field: "Leadership",
    image: "https://www.worldgreenline.org/images/team.jpg",
    description:
      "Passionate advocate for social development, supporting strategic decisions and guiding organizational growth.",
  },
  {
    name: "Avinash Prasad",
    title: "Secretary",
    field: "Management",
    image: "https://www.worldgreenline.org/images/team6.jpg",
    description:
      "Responsible for organizational coordination, ensuring smooth communication and effective governance.",
  },
  {
    name: "Devnarayan Kushwaha",
    title: "Treasurer",
    field: "Finance",
    image: "https://www.worldgreenline.org/images/team5.jpg",
    description:
      "Finance steward dedicated to transparency and efficiency in managing the organization’s resources.",
  },
  {
    name: "Lal Chand Mahto",
    title: "Member",
    field: "Community",
    image: "https://www.worldgreenline.org/images/team.jpg",
    description:
      "Active contributor in grassroots programs, fostering strong bonds between the organization and the community.",
  },
  {
    name: "Kriti Rajoria",
    title: "Member",
    field: "Outreach",
    image: "https://www.worldgreenline.org/images/kirti.jpg",
    description:
      "Focused on outreach and advocacy, working to amplify awareness about social and environmental initiatives.",
  },
  {
    name: "Subrat Kumar Acharya",
    title: "Member",
    field: "Community",
    image: "https://www.worldgreenline.org/images/team7.jpg",
    description:
      "Dedicated team player, contributing his skills to strengthen organizational initiatives and field operations.",
  },
  {
    name: "Dipendra Pravejan",
    title: "Member",
    field: "Programs",
    image: "https://www.worldgreenline.org/images/team4.jpg",
    description:
      "Committed to designing and implementing impactful programs that empower communities and create lasting change.",
  },
  {
    name: "Bharat Sahoo",
    title: "Member",
    field: "Programs",
    image: "https://www.worldgreenline.org/images/team3.jpg",
    description:
      "Engaged in program development and execution, ensuring on-ground success and meaningful outcomes.",
  },
];


// --- Team Card ---
const TeamCard = ({ member }) => (
  <div className="bg-gradient-to-b from-[#097f60] to-[#06503c] border border-white/10 rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
    <img
      src={member.image}
      alt={member.name}
      className="w-72 h-72  object-cover rounded-full border-4 border-lime-400/30 mb-4"
    />
    <h4 className="text-2xl font-bold text-white">{member.name}</h4>
    <p className="text-lime-400 text-sm  font-semibold">{member.title}</p>
    {/* <span className="inline-block mt-2 mb-3 text-xs px-3 py-1 rounded-full bg-lime-500/20 text-lime-300">
      {member.field}
    </span> */}
    <p className="text-gray-300 text-sm leading-relaxed mt-3">{member.description}</p>
  </div>
);

// --- Main Section ---
const TeamSection = () => {
  const [selectedField] = useState("All");

  const filteredTeam =
    selectedField === "All"
      ? teamData
      : teamData.filter((member) => member.field === selectedField);

  return (
    <section className="relative py-16 sm:py-24 px-4">
      <ParticleBackground/>
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white">Our Team</h2>
        <p className="text-base md:text-lg text-gray-300">
          Meet the dedicated professionals working tirelessly to make our
          environmental vision a reality.
        </p>
        <div className="h-1 w-20 bg-lime-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Team Grid (3 cards per row max) */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {filteredTeam.map((member, idx) => (
          <TeamCard key={idx} member={member} />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
