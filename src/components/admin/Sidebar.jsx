import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../api/firebase";
import { LogOut, FolderKanban, PenLine, GalleryHorizontal, FileText } from "lucide-react"; // Added FileText icon

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-300 hover:bg-green-700 hover:text-white"
    }`;

  return (
    <div className="w-64 h-screen bg-neutral-900 text-white shadow-xl flex flex-col">
      <div className="text-center font-bold text-2xl py-6 border-b border-neutral-700">
        Admin Panel
      </div>

      <nav className="flex flex-col px-4 py-6 space-y-2 flex-1">
        <NavLink to="/dashboard/projects" className={linkClasses}>
          <FolderKanban className="w-5 h-5" />
          Projects
        </NavLink>
        <NavLink to="/dashboard/blogs" className={linkClasses}>
          <PenLine className="w-5 h-5" />
          Blogs
        </NavLink>
        <NavLink to="/dashboard/featured-gallery" className={linkClasses}>
          <GalleryHorizontal className="w-5 h-5" />
          Gallery
        </NavLink>
        <NavLink to="/dashboard/articlesAdmin" className={linkClasses}> {/* Fixed this line */}
          <FileText className="w-5 h-5" /> {/* Changed icon */}
          Reports & Articles
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 m-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}