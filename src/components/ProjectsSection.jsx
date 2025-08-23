import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import { useSwipeable } from "react-swipeable";

const ProjectImage = ({ src, alt, className }) => (
  <div className={`${className} bg-gray-700 flex items-center justify-center`}>
    {src ? (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/fallback.jpg";
        }}
      />
    ) : (
      <span className="text-gray-400">Image not available</span>
    )}
  </div>
);

const ImagePopup = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // New: Handle click outside the popup content
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
    setShowFullDescription(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
    setShowFullDescription(false);
  };

  const needsTruncation = project.description?.length > 150;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50 p-3"
      onClick={handleOutsideClick} // Added click-outside handler
    >
      <div className="backdrop-blur bg-black/60 border border-white/40 rounded-lg w-full shadow-2xl max-w-6xl lg:max-h-[95vh] max-h-[50vh] overflow-hidden transition-all duration-300 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-2 sm:p-4 border-b border-white/20">
          <div>
            <h3 className="text-xl font-bold text-lime-300">{project.title}</h3>
            {project.workWith && (
              <p className="text-gray-300 text-xs">{project.workWith}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Image Display */}
        <div className="relative bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center h-[500px]">
          {project.images?.length > 0 ? (
            <>
              <img
                src={project.images[currentImageIndex]}
                alt={`Project ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback.jpg";
                }}
              />
              {project.description && (
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/80  p-2 sm:pt-16 sm:p-4 ${
                    showFullDescription
                      ? "max-h-[15vh] overflow-y-auto sm:max-h-none sm:overflow-y-visible"
                      : ""
                  }`}
                >
                  <p className="text-white sm:text-sm text-xs text-justify">
                    {showFullDescription
                      ? project.description
                      : (() => {
                          if (window.innerWidth < 640) {
                            const words = project.description.split(" ");
                            const truncated = words.slice(0, 20).join(" ");
                            return truncated + (words.length > 20 ? "..." : "");
                          }
                          return project.description.length > 280
                            ? project.description.slice(0, 280) + "..."
                            : project.description;
                        })()}
                    {needsTruncation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullDescription(!showFullDescription);
                        }}
                        className="text-lime-400 hover:text-lime-300 font-medium ml-2"
                      >
                        {showFullDescription ? "Show less" : "Show more"}
                      </button>
                    )}
                  </p>
                </div>
              )}

              {project.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-opacity-100 bg-opacity-50 text-white sm:p-3 p-1 rounded-full"
                  >
                    <ChevronLeft className="sm:w-8 sm:h-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-opacity-100 bg-opacity-50 text-white sm:p-3 p-1 rounded-full"
                  >
                    <ChevronRight className="sm:w-8 sm:h-8" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="text-gray-400">No images available</div>
          )}
        </div>

        {/* Thumbnails */}
        {project.images?.length > 1 && (
          <div className="flex gap-2 justify-center items-center p-3 border-t  border-white/20 overflow-x-auto custom-scrollbar">
            {project.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImageIndex(idx);
                  setShowFullDescription(false);
                }}
                className={`sm:w-20 sm:h-14 w-14 h-10 rounded-md overflow-hidden border-2 ${
                  currentImageIndex === idx
                    ? "border-lime-400"
                    : "border-transparent"
                } transition-all duration-200`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback.jpg";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding-right: 60px;
        }
      `}</style>
    </div>
  );
};
//
const typeColors = {
  // welfare: "bg-gradient-to-r from-red-400 to-pink-500",
  water: "bg-gradient-to-r from-sky-400 to-blue-500",
  environment: "bg-gradient-to-r from-green-500 to-emerald-600",
  waste: "bg-gradient-to-r from-lime-400 to-green-500",
  awareness: "bg-gradient-to-r from-indigo-400 to-purple-500",
};

const AllProjectsPopup = ({ projects = [], onClose, onProjectClick }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // New: Handle click outside the popup content
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOutsideClick} // Added click-outside handler
    >
      <div className="backdrop-blur bg-black/60 rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-700">
          <h3 className="text-2xl font-bold text-lime-300">All Projects</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Projects Grid */}
        <div className="p-5 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[65vh] overflow-y-auto pr-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out relative group"
                onClick={() => onProjectClick(project)}
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                {/* Project content */}
                <div className="h-full flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <ProjectImage
                      src={project.img || "/fallback.jpg"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-grow bg-white/10 backdrop-blur-md rounded-b-md border-t border-white/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lime-300">
                          {project.title}
                        </h3>
                        {project.workWith && (
                          <p className="text-gray-300 text-xs">
                            {project.workWith}
                          </p>
                        )}
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900 text-green-300 h-fit">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2 min-h-[2.5em]">
                      {project.description}
                    </p>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        {/* <span className="text-xs text-gray-400">Progress</span> */}
                        {/* <span className="text-xs font-medium text-white">
                          {project.progress}%
                        </span> */}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            typeColors[project.type] || "bg-gray-500"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollbar Styling */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
          }
        `}</style>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch projects from Firestore
  useEffect(() => {
// In ProjectsSection.js, update the fetchProjects function
const fetchProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectsData = [];
    querySnapshot.forEach((doc) => {
      projectsData.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort projects by order field (default to 0 if not set)
    const sortedProjects = projectsData.sort((a, b) => 
      (a.order || 0) - (b.order || 0)
    );
    
    setProjects(sortedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
  } finally {
    setLoading(false);
  }
};

    fetchProjects();
  }, []);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleProjects = isMobile
    ? [projects[startIndex]]
    : projects.slice(startIndex, startIndex + 3); // keep 3 on desktop

  const nextProjects = () => {
    setStartIndex((prev) => {
      if (isMobile) {
        return (prev + 1) % projects.length;
      }
      return (prev + 1) % Math.max(1, projects.length - 2);
    });
  };

  const prevProjects = () => {
    setStartIndex((prev) => {
      if (isMobile) {
        return (prev - 1 + projects.length) % projects.length;
      }
      return (
        (prev - 1 + Math.max(1, projects.length - 2)) %
        Math.max(1, projects.length - 2)
      );
    });
  };

  // Add swipe handlers for mobile
  const handlers = useSwipeable({
    onSwipedLeft: () => nextProjects(),
    onSwipedRight: () => prevProjects(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (loading) {
    return (
      <section id="projects" className="px-4 sm:px-16 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="px-4 sm:px-16 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-lime-300 text-center">
            Our Work
          </h2>
          <p className="text-gray-300 mt-2 max-w-xl mx-auto text-center">
            Discover our ongoing initiatives to restore and protect our
            environment through sustainable practices and community engagement.
          </p>
          <div className="h-1 w-24 bg-lime-400 mx-auto mt-4 rounded-full" />
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No projects found.</p>
          </div>
        ) : (
          <>
            <div className="relative group">
              {/* Mobile Navigation Buttons */}
              <button
                onClick={prevProjects}
                disabled={startIndex === 0}
                className="md:hidden absolute -left-1 top-1/2 transform -translate-y-1/2 z-10 
                          bg-black/60 backdrop-blur-sm p-2 rounded-full opacity-0 
                          transition-opacity duration-200 group-hover:opacity-100"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={nextProjects}
                disabled={startIndex === projects.length - 1}
                className="md:hidden absolute -right-1 top-1/2 transform -translate-y-1/2 z-10 
                          bg-black/60 backdrop-blur-sm p-2 rounded-full opacity-0 
                          transition-opacity duration-200 group-hover:opacity-100"
                aria-label="Next project"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* Desktop Navigation Buttons */}
              <button
                onClick={prevProjects}
                disabled={projects.length <= 3}
                className="hidden md:block absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 
                          bg-green-700 hover:bg-green-600 p-2 rounded-full transition-all 
                          duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-7 h-7 text-white" />
              </button>

              {/* Projects Container */}
              <div
                {...handlers}
                className={`
                  ${
                    isMobile
                      ? "flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 px-4"
                      : "grid grid-cols-3 gap-6 px-10"
                  }
                `}
              >
                {visibleProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`
                      ${isMobile ? "flex-shrink-0 w-[85vw] snap-center" : ""}
                      bg-[#114429] rounded-lg overflow-hidden cursor-pointer 
                      md:hover:scale-105 transition-transform
                    `}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="w-full h-48 overflow-hidden">
                      <ProjectImage
                        src={project.img}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 text-sm flex-grow flex flex-col justify-between min-h-[150px]">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-bold text-lime-300">
                              {project.title}
                            </h3>
                            {project.workWith && (
                              <h3 className="rounded-xl border-none mt-2 text-xs font-bold h-fit">
                                {project.workWith}
                              </h3>
                            )}
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-xl text-xs font-medium bg-green-900 text-white h-fit">
                            {project.status}
                          </span>
                        </div>

                        <p className="text-gray-100 text-sm line-clamp-2 min-h-[2.5em]">
                          {project.description}
                        </p>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          {/* <span className="text-xs text-gray-400"> Progress </span> */}
                          {/* <span className="text-xs font-medium text-white">
                            {project.progress}%
                          </span> */}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              typeColors[project.type] || "bg-gray-500"
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={nextProjects}
                disabled={projects.length <= 3}
                className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 
                          bg-green-700 hover:bg-green-600 p-2 rounded-full transition-all 
                          duration-200 hover:scale-110"
              >
                <ChevronRight className="w-7 h-7 text-white" />
              </button>
            </div>

            {/* Mobile indicators (dots) */}
            <div className="md:hidden flex justify-center gap-2 mt-4">
              {projects.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    startIndex === idx ? "bg-lime-400" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>

            <div className="text-right mt-6 mr-10 hidden md:block">
              <button
                onClick={() => setShowAllProjects(true)}
                className="inline-flex items-center px-4 py-2 border border-green-700 
  bg-gradient-to-r from-green-500 to-green-600 
  hover:from-green-600 hover:to-green-700 
   rounded-lg transition-all duration-200 text-white"
              >
                View All Projects
              </button>
            </div>
          </>
        )}

        {selectedProject && (
          <ImagePopup
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}

        {showAllProjects && (
          <AllProjectsPopup
            projects={projects}
            onClose={() => setShowAllProjects(false)}
            onProjectClick={(project) => {
              setShowAllProjects(false);
              setSelectedProject(project);
            }}
          />
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }
        /* Make buttons appear briefly on touch */
        .group:active .absolute button.md\:hidden {
          opacity: 1 !important;
          transition-duration: 100ms;
        }

        /* Disabled state styling */
        .absolute button:disabled {
          opacity: 0.3 !important;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
};

export default ProjectsSection;
