import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Sliders,
  ImagePlus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../api/firebase";

// Cloudinary configuration
const cloudName = "dnvinnnku"; // Replace with your Cloudinary cloud name
const uploadPreset = "wgl_website"; // Replace with your upload preset

const ProjectAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "Planned",
    progress: 0,
    type: "forest",
    img: "",
    images: [],
  });
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData = [];
        querySnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() });
        });
        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Handle image upload
  const handleImageUpload = async (e, isMainImage = false) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    try {
      setLoading(true);
      setImageError(false);
      
      // Upload all images to Cloudinary
      const uploadedUrls = await Promise.all(
        files.map(file => uploadImageToCloudinary(file))
      );

      if (selectedProject) {
        if (isMainImage) {
          setSelectedProject({
            ...selectedProject,
            img: uploadedUrls[0] || selectedProject.img,
          });
        } else {
          setSelectedProject({
            ...selectedProject,
            images: [...selectedProject.images, ...uploadedUrls],
          });
        }
      } else {
        if (isMainImage) {
          setNewProject({
            ...newProject,
            img: uploadedUrls[0] || newProject.img,
          });
        } else {
          setNewProject({
            ...newProject,
            images: [...newProject.images, ...uploadedUrls],
          });
        }
      }
    } catch (error) {
      console.error("Error handling image upload:", error);
      setImageError(true);
    } finally {
      setLoading(false);
    }
  };

  // Add project to Firestore
  const addProject = async () => {
    if (!newProject.title || !newProject.img) {
      alert("Title and main image are required");
      return;
    }

    try {
      setLoading(true);
      const projectToAdd = {
        ...newProject,
        images: newProject.images.length > 0 ? newProject.images : [newProject.img],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "projects"), projectToAdd);
      
      // Update local state
      setProjects([...projects, { ...projectToAdd, id: docRef.id }]);
      setShowAddForm(false);
      setNewProject({
        title: "",
        description: "",
        status: "Planned",
        progress: 0,
        type: "forest",
        img: "",
        images: [],
      });
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update project in Firestore
  const updateProject = async () => {
    if (!selectedProject) return;
    
    try {
      setLoading(true);
      const projectRef = doc(db, "projects", selectedProject.id);
      await updateDoc(projectRef, {
        title: selectedProject.title,
        description: selectedProject.description,
        status: selectedProject.status,
        progress: selectedProject.progress,
        type: selectedProject.type,
        img: selectedProject.img,
        images: selectedProject.images,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setProjects(
        projects.map((p) => (p.id === selectedProject.id ? selectedProject : p))
      );
      setSelectedProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete project from Firestore
const deleteProject = async (id, images = []) => {
  if (!id) return;

  if (window.confirm("Are you sure you want to delete this project?")) {
    try {
      setLoading(true);

      // 1️⃣ Delete images from Cloudinary (optional, so you don’t keep unused files)
      for (const imgUrl of images) {
        const publicId = imgUrl.split("/").pop().split(".")[0]; // extract public_id
        await fetch("/api/sign-cloudinary-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
      }

      // 2️⃣ Delete from Firestore
      await deleteDoc(doc(db, "projects", id));

      // 3️⃣ Update local state
      setProjects((prev) => prev.filter((p) => p.id !== id));

      // If this was selectedProject, clear it
      if (selectedProject?.id === id) setSelectedProject(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    } finally {
      setLoading(false);
    }
  }
};


  // Navigate through images
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % (selectedProject?.images?.length || 1)
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + (selectedProject?.images?.length || 1)) % 
      (selectedProject?.images?.length || 1)
    );
  };

  return (
    <div className="container mx-auto p-4">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-lime-500">Projects Admin</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Project
        </button>
        
      </div>

      {projects.length === 0 && !loading ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No projects found. Add your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden relative">
                {project.img ? (
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                  <h3 className="text-white font-bold">{project.title}</h3>
                  <p className="text-gray-300 text-sm">
                    {project.status} - {project.progress}%
                  </p>
                </div>
              </div>
              <div className="p-4 flex justify-between">
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setCurrentImageIndex(0);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this project?")) {
                      deleteProject(project.id);
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-[#1f2937] to-[#111827] rounded-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto hidden-scroll">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-lime-400">
                Add New Project
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Title*</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="w-full bg-[#2d3748] focus:ring-2 focus:ring-lime-400 text-white p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({ ...newProject, status: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white p-2 rounded"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Type</label>
                <select
                  value={newProject.type}
                  onChange={(e) =>
                    setNewProject({ ...newProject, type: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white p-2 rounded"
                >
                  <option value="forest">Forest</option>
                  <option value="water">Water</option>
                  <option value="infra">Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">
                  Progress: {newProject.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProject.progress}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      progress: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 text-white p-2 rounded h-24"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Main Image*</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded p-4 cursor-pointer hover:border-gray-500">
                  {newProject.img ? (
                    <div className="h-32 flex items-center justify-center">
                      <img
                        src={newProject.img}
                        alt="Preview"
                        className="max-h-28 rounded shadow-md"
                      />
                    </div>
                  ) : (
                    <>
                      <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-gray-400">Click to upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </label>
                {imageError && (
                  <p className="text-red-500 text-sm mt-1">
                    Error uploading image. Please try again.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-1">
                  Additional Images
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newProject.images.map((img, i) => (
                    <div key={i} className="relative bg-gray-700 p-2 rounded">
                      <img
                        src={img}
                        alt={`Preview ${i}`}
                        className="w-16 h-16 object-cover rounded shadow"
                      />
                      <button
                        onClick={() =>
                          setNewProject({
                            ...newProject,
                            images: newProject.images.filter(
                              (_, index) => index !== i
                            ),
                          })
                        }
                        className="absolute top-0 right-0 bg-lime-500 hover:bg-lime-600 text-black p-0.5 rounded-full transform translate-x-1 -translate-y-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded p-2 cursor-pointer hover:border-gray-500">
                  <ImagePlus className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-gray-400">Add more images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={addProject}
                  disabled={!newProject.title || !newProject.img || loading}
                  className={`px-4 py-2 rounded ${
                    !newProject.title || !newProject.img || loading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {loading ? "Adding..." : "Add Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-lime-400">Edit Project</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Project Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-1">Title*</label>
                      <input
                        type="text"
                        value={selectedProject.title}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            title: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white p-2 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">Status</label>
                      <select
                        value={selectedProject.status}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            status: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white p-2 rounded"
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">Type</label>
                      <select
                        value={selectedProject.type}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            type: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white p-2 rounded"
                      >
                        <option value="forest">Forest</option>
                        <option value="water">Water</option>
                        <option value="infra">Infrastructure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">
                        Progress: {selectedProject.progress}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedProject.progress}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            progress: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={selectedProject.description}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white p-2 rounded h-24"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Images</h3>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-1">
                      Main Image
                    </label>
                    <div className="relative">
                      {selectedProject.img ? (
                        <img
                          src={selectedProject.img}
                          alt="Main"
                          className="w-full h-48 object-contain bg-gray-700 rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <label className="absolute bottom-2 right-2 bg-black bg-opacity-50 p-1 rounded cursor-pointer">
                        <ImagePlus className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">
                      Additional Images
                    </label>
                    {selectedProject.images.length > 0 ? (
                      <div className="relative mb-4">
                        <img
                          src={selectedProject.images[currentImageIndex]}
                          alt={`Gallery ${currentImageIndex}`}
                          className="w-full h-48 object-contain bg-gray-700 rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                        {selectedProject.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
                            >
                              <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
                            >
                              <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-700 flex items-center justify-center rounded mb-4">
                        <span className="text-gray-400">No additional images</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedProject.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={img}
                            alt=""
                            className="w-16 h-16 object-cover rounded cursor-pointer"
                            onClick={() => setCurrentImageIndex(i)}
                          />
                          <button
                            onClick={() =>
                              setSelectedProject({
                                ...selectedProject,
                                images: selectedProject.images.filter(
                                  (_, index) => index !== i
                                ),
                              })
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded p-2 cursor-pointer hover:border-gray-500">
                      <ImagePlus className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-gray-400">Add more images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-between">
              <button
                onClick={deleteProject}
                disabled={loading}
                className={`flex items-center px-4 py-2 rounded ${
                  loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {loading ? "Deleting..." : "Delete Project"}
              </button>

              <div className="space-x-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  disabled={loading}
                  className={`px-4 py-2 rounded ${
                    loading ? "bg-gray-600 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-500 text-white"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={updateProject}
                  disabled={loading}
                  className={`px-4 py-2 rounded ${
                    loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAdmin;