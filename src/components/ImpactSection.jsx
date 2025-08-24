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
              desc: "Native species planted across various regions",
            },
            {
              value: "12",
              label: "Water Bodies Restored",
              desc: "Ponds and lakes revitalized for communities",
            },
            {
              value: "25,000+",
              label: "People Benefited",
              desc: "Through clean water and green spaces",
            },
            {
              value: "30+",
              label: "Schools Engaged",
              desc: "In environmental education programs",
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
                {/* <div className="flex items-center gap-3"> */}
                <img
                  src="images\sdg\Sustainable_Development_Goal_01NoPoverty.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                {/* <span className="text-sm">Clean Water and Sanitation</span> */}
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_02ZeroHunger.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                {/* <span className="text-sm">Climate Action</span> */}
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_04QualityEducation.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                {/* <span className="text-sm">Life on Land</span> */}
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_06CleanWaterSanitation.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                {/* <span className="text-sm">Partnerships for the Goals</span> */}
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_13Climate.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                {/* <span className="text-sm">Partnerships for the Goals</span> */}
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="images\sdg\Sustainable_Development_Goal_15LifeOnLand.svg"
                  alt="Clean Water and Sanitation"
                  className="sm:w-36 sm:h-36 object-cover rounded-xl sm:hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                {/* <span className="text-sm">Partnerships for the Goals</span> */}
              </div>
            </div>
          </div>

          {/* Impact Assessment */}
          {/* <div className="bg-[#075840] rounded-xl p-6 border  border-green-700 shadow-lg text-center">
            <h4 className="text-sm font-semibold text-lime-300 mb-4">
              Environmental Impact Assessment
            </h4> 
            {[
              { label: "Carbon Sequestration", value: 85 },
              { label: "Water Quality Improvement", value: 92 },
              { label: "Biodiversity Enhancement", value: 78 },
              { label: "Community Engagement", value: 95 },
            ].map((item, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-white">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {item.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div> */}

          < img
            src="images\goals.jpg"
            alt="Environmental Impact"
            className="w-full max-w-md sm:max-w-lg  mx-auto sm:mt-20 object-containn shadow rounded-2xl "
          />
        </div>
      </div>
    </section>
  );
}

{
  /* <img
              src="public\images\global-goals.png"
              alt="Environmental Impact"
              className="w-full max-w-md sm:max-w-lg  bg-white mx-auto mt-4 object-contain rounded-lg"
            /> */
}
