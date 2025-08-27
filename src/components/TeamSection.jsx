// import ParticleBackground from "./ParticleBackground";

// --- Data ---
const teamData = [
  { name: "Pritiranjan Dash", title: "Founder & President", image: "https://www.worldgreenline.org/images/team1.jpg" },
  { name: "Vishal Kumar", title: "Vice President", image: "https://www.worldgreenline.org/images/team.jpg" },
  { name: "Avinash Prasad", title: "Secretary", image: "https://www.worldgreenline.org/images/team6.jpg" },
  { name: "Devnarayan Kushwaha", title: "Treasurer", image: "https://www.worldgreenline.org/images/team5.jpg" },
  { name: "Lal Chand Mahto", title: "Member", image: "https://www.worldgreenline.org/images/team.jpg" },
  { name: "Kriti Rajoria", title: "Member", image: "https://www.worldgreenline.org/images/kirti.jpg" },
  { name: "Subrat Kumar Acharya", title: "Member", image: "https://www.worldgreenline.org/images/team7.jpg" },
  { name: "Dipendra Pravejan", title: "Member", image: "https://www.worldgreenline.org/images/team4.jpg" },
  { name: "Bharat Sahoo", title: "Member", image: "https://www.worldgreenline.org/images/team3.jpg" },
];

// --- Team Card ---
const TeamCard = ({ member }) => (
  <div className="flex flex-col items-center text-center">
    <img
      src={member.image}
      alt={member.name}
      className="w-40 h-40 object-cover rounded-full border-4 border-lime-400/40 shadow-md mb-4"
    />
    <h4 className="text-lg font-semibold text-white">{member.name}</h4>
    <p className="text-sm text-lime-400">{member.title}</p>
  </div>
);

// --- Main Section ---
const TeamSection = () => {
  const firstRow = teamData.slice(0, 5); // first 5
  const secondRow = teamData.slice(5);  // remaining 4

  return (
    <section className="relative py-16 sm:py-24 px-4">
      {/* <ParticleBackground /> */}

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white">Our Team</h2>
        <p className="text-base md:text-lg text-gray-300">
          Meet the dedicated professionals making our vision a reality.
        </p>
        <div className="h-1 w-20 bg-lime-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Row 1: 5 members */}
      <div className="flex justify-center gap-10 flex-wrap mb-12">
        {firstRow.map((member, idx) => (
          <TeamCard key={idx} member={member} />
        ))}
      </div>

      {/* Row 2: 4 members centered */}
      <div className="flex justify-center gap-10 flex-wrap">
        {secondRow.map((member, idx) => (
          <TeamCard key={idx} member={member} />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
