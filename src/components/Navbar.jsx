import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/images/logo.svg";
import { navItems } from "../constants";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href) => {
    setMobileDrawerOpen(false);

    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (location.pathname !== "/") {
        navigate("/", { replace: true });
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <nav className="sticky top-0 z-50 py-3 bg-[#064E3B] text-white shadow-md">
      <div className="container mx-auto relative">
        <div className="flex justify-between lg:px-5 sm:px-6 px-4 items-center">
          {/* Logo with Home Link */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate("/")}
              className="focus:outline-none"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 ml-6 sm:mr-2 scale-[3]"
              />
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex lg:space-x-6 items-center">
            {navItems.map((item, index) => (
              <li key={index} className="relative group">
                <button
                  onClick={() => handleNavClick(item.href)}
                  className="px-1 py-2 text-sm xl:text-base transition-all"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#16A34A] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setMobileDrawerOpen(true)}
              className="focus:outline-none"
            >
              <Menu />
            </button>
          </div>
        </div>
        
        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed right-0 top-0 h-full w-64 bg-[#064D39] text-white shadow-lg p-6 transition-transform transform">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">Menu</h2>
                <button 
                  onClick={() => setMobileDrawerOpen(false)}
                  className="focus:outline-none"
                >
                  <X />
                </button>
              </div>
              <ul className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <button
                      className="block w-full text-left px-2 py-2 hover:bg-green-700 rounded transition-all focus:outline-none"
                      onClick={() => handleNavClick(item.href)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;