import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/images/logo.svg";
import { navItems } from "../constants";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [impactDropdownOpen, setImpactDropdownOpen] = useState(false);
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href) => {
    setMobileDrawerOpen(false);
    setImpactDropdownOpen(false);
    setContactDropdownOpen(false);

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
    <nav className="sticky top-0 z-50  py-2 bg-green-800 text-white shadow-md">
      <div className="container mx-auto relative">
        {" "}
        {/* px-4 sm:px-6 md:px-8 lg:px-12 */}
        <div className="flex justify-between lg:px-5 sm:px-6 px-4  items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 ml-6 sm:mr-2 scale-[3]"
            />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex lg:space-x-6 items-center">
            {navItems.map((item, index) =>
              item.label === "Impact" ? (
                <li key={index} className="relative cursor-pointer">
                  <button
                    onClick={() => setImpactDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1 text-sm xl:text-base hover:text-green-300 transition-all"
                  >
                    Impact
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        impactDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {impactDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-2">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-green-100"
                        onClick={() => handleNavClick("#impact")}
                      >
                        Our Impact
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-green-100"
                        onClick={() => navigate("/blogs")}
                      >
                        Blogs
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-green-100"
                        onClick={() => navigate("/more")}
                      >
                        more
                      </button>
                    </div>
                  )}
                </li>
              ) : item.label === "Contact" ? (
                <li key={index} className="relative cursor-pointer">
                  <button
                    onClick={() => setContactDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1 text-sm xl:text-base hover:text-green-300 transition-all"
                  >
                    Contact
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        contactDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {contactDropdownOpen && (
                    <div className="absolute -left-8 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-2 z-50">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-green-100"
                        onClick={() => handleNavClick("#contact")}
                      >
                        Contact Us
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-green-100"
                        onClick={() => handleNavClick("/InternshipPage")}
                      >
                        Join Us
                      </button>
                      
                      
                    </div>
                  )}
                </li>
              ) : (
                <li
                  key={index}
                  className="cursor-pointer text-sm xl:text-base hover:text-green-300 transition-all"
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </li>
              )
            )}
          </ul>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setMobileDrawerOpen(true)}>
              <Menu />
            </button>
          </div>
        </div>
        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed right-0 top-0 h-full w-64 bg-green-900 text-white shadow-lg p-6 transition-transform transform">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={() => setMobileDrawerOpen(false)}>
                  <X />
                </button>
              </div>
              <ul className="flex flex-col space-y-4">
                {navItems.map((item, index) =>
                  item.label === "Impact" ? (
                    <li key={index}>
                      <button
                        onClick={() => setImpactDropdownOpen((prev) => !prev)}
                        className="flex items-center justify-between w-full px-2 py-2  rounded-md"
                      >
                        Impact
                        <ChevronDown
                          className={`transition-transform ${
                            impactDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {impactDropdownOpen && (
                        <div className="ml-4 mt-2 space-y-2">
                          <button
                            onClick={() => {
                              handleNavClick("#impact");
                            }}
                            className="block w-full text-left px-2 py-1 hover:bg-green-600 rounded"
                          >
                            Our Impact
                          </button>
                          <button
                            onClick={() => {
                              navigate("/blogs");
                              setMobileDrawerOpen(false);
                            }}
                            className="block w-full text-left px-2 py-1 hover:bg-green-600 rounded"
                          >
                            Blogs
                          </button>
                          <button
                            onClick={() => {
                              navigate("/more");
                              setMobileDrawerOpen(false);
                            }}
                            className="block w-full text-left px-2 py-1 hover:bg-green-600 rounded"
                          >
                            more
                          </button>
                        </div>
                      )}
                    </li>
                  ) : item.label === "Contact" ? (
                    <li key={index}>
                      <button
                        onClick={() => setContactDropdownOpen((prev) => !prev)}
                        className="flex items-center justify-between w-full px-2 py-2 rounded-md"
                      >
                        Contact
                        <ChevronDown
                          className={`transition-transform ${
                            contactDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {contactDropdownOpen && (
                        <div className="ml-4 mt-2 space-y-2">
                            <button
                            onClick={() => {
                              handleNavClick("#contact");
                            }}
                            className="block w-full text-left px-2 py-1 hover:bg-green-600 rounded"
                          >
                          Contact Us
                          </button>
                          <button
                            onClick={() => {
                              navigate("/internship");
                              setMobileDrawerOpen(false);
                            }}
                            className="block w-full text-left px-2 py-1 hover:bg-green-600 rounded"
                          >
                            Internship
                          </button>
                          <button
                            onClick={() => {
                              navigate("/volunteer");
                              setMobileDrawerOpen(false);
                            }}
                            className="block w-full text-left px-2 py-1 hover:bg-green-600 rounded"
                          >
                            Volunteer
                          </button>
                          <button
                            onClick={() => {
                              navigate("/career");
                              setMobileDrawerOpen(false);
                            }}
                            className="block w-full text-left px-2 py-1 hover:bg-green-600 rounded"
                          >
                            Career
                          </button>
                        </div>
                      )}
                    </li>
                  ) : (
                    <li key={index}>
                      <button
                        className="block w-full text-left px-2 py-2 hover:bg-green-700 rounded"
                        onClick={() => handleNavClick(item.href)}
                      >
                        {item.label}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
