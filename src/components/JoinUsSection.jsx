import React from "react";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JoinUsSection = () => {
  const navigate = useNavigate();

  const handleJoinClick = (e) => {
    e.preventDefault();
    navigate("/JoinUS"); // matches the route in App.js
  };

  return (
    <div>
      <div className="text-center  pb-10">
        <h3 className="text-3xl font-bold text-lime-300 mb-3">
          Ready to Make a Difference?
        </h3>
         <p className="text-gray-300 max-w-2xl sm:mx-auto mx-4">
          If you're passionate about our cause, let us know what position
          you're interested in by using the form below. We're always looking
          for dedicated individuals to join our team.
        </p>
        <button
          onClick={handleJoinClick}
          className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-lime-400 text-green-900 font-semibold rounded-md hover:bg-lime-300 transition-all transform hover:scale-105 mt-6"
        >
          <Briefcase className="w-5 h-5" /> Join Our Team
        </button>
      </div>
    </div>
  );
};

export default JoinUsSection;
