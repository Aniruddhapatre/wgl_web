// import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
// import { resourcesLinks, platformLinks, communityLinks } from "../constants";
// import logo from "/images/logo.svg";

// const Footer = () => {
//   return (
//     <footer className="no-cursor text-white pt-12 px-4 sm:px-16 border-t border-lime-500">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

//         {/* Logo + About */}
//         <div>
//           <div className="flex items-center gap-2 mb-4">
//             <img src={logo} alt="logo" className="w-18 h-8 scale-[1.5]" />
//           </div>
//           <p className="text-gray-400 text-sm leading-relaxed mb-4">
//             Making sustainability smarter with AI. Clean, green, and connected — that’s our mission.
//           </p>
//           <div className="flex gap-3 mt-2">
//             <a href="https://www.facebook.com/worldgreenline.org/" className="hover:text-lime-400 transition-all duration-200"><Facebook size={18} /></a>
//             <a href="https://twitter.com/worldgreenline" className="hover:text-lime-400 transition-all duration-200"><Twitter size={18} /></a>
//             <a href="https://www.instagram.com/worldgreenline_org/" className="hover:text-lime-400 transition-all duration-200"><Instagram size={18} /></a>
//             <a href="https://www.linkedin.com/company/worldgreenline/?viewAsMember=true" className="hover:text-lime-400 transition-all duration-200"><Linkedin size={18} /></a>
//           </div>
//         </div>

//         {/* Product */}
//         <div>
//           <h3 className="text-lg font-semibold text-lime-400 mb-4">Product</h3>
//           <ul className="space-y-2 text-sm">
//             {resourcesLinks.map((link, index) => (
//               <li key={index}>
//                 <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-200">
//                   {link.text}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Useful Link */}
//         <div>
//           <h3 className="text-lg font-semibold text-lime-400 mb-4">Useful Link</h3>
//           <ul className="space-y-2 text-sm">
//             {platformLinks.map((link, index) => (
//               <li key={index}>
//                 <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-200">
//                   {link.text}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Address */}
//         <div>
//           <h3 className="text-lg font-semibold text-lime-400 mb-4">Address</h3>
//           <p className="text-gray-300 text-sm leading-relaxed">
//             Shiv Shakti Nagar, Near Shiv Mandir <br/>
//             Chas, Bokaro, Jharkhand, <br/>
//             India - 827013 
//           </p>
//         </div>
//       </div>

//       <div className="text-center text-gray-500 text-sm mt-10 border-t border-neutral-700 pt-6">
//         © {new Date().getFullYear()} World Green Line. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { resourcesLinks, platformLinks, communityLinks } from "../constants";
import logo from "/images/logo.svg";

const Footer = () => {
  return (
    <footer className="text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-lime-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        
        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-lime-400">World Green Line</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Making sustainability smarter with AI. Clean, green, and connected — that's our mission.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/worldgreenline.org/" 
               className="text-gray-400 hover:text-lime-400 transition-colors duration-300"
               aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com/worldgreenline" 
               className="text-gray-400 hover:text-lime-400 transition-colors duration-300"
               aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="https://www.instagram.com/worldgreenline_org/" 
               className="text-gray-400 hover:text-lime-400 transition-colors duration-300"
               aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://www.linkedin.com/company/worldgreenline/" 
               className="text-gray-400 hover:text-lime-400 transition-colors duration-300"
               aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5 pb-2 border-b border-lime-500/30 inline-block">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {platformLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} 
                   className="text-gray-400 hover:text-lime-400 transition-colors duration-300 flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>{link.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5 pb-2 border-b border-lime-500/30 inline-block">
            Resources
          </h3>
          <ul className="space-y-3">
            {resourcesLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} 
                   className="text-gray-400 hover:text-lime-400 transition-colors duration-300 flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>{link.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-white mb-5 pb-2 border-b border-lime-500/30 inline-block">
            Contact Us
          </h3>
          
          <div className="flex items-start gap-3">
            <MapPin className="text-lime-400 mt-0.5 w-5 h-5 shrink-0" />
            <address className="text-gray-400 text-sm not-italic">
              Shiv Shakti Nagar, Near Shiv Mandir<br />
              Chas, Bokaro, Jharkhand<br />
              India - 827013
            </address>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="text-lime-400 mt-0.5 w-5 h-5 shrink-0" />
            <a href="mailto:info@worldgreenline.org" 
               className="text-gray-400 hover:text-lime-400 transition-colors duration-300 text-sm">
              info@worldgreenline.org
            </a>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="text-lime-400 mt-0.5 w-5 h-5 shrink-0" />
            <a href="tel:+91 9006613222" 
               className="text-gray-400 hover:text-lime-400 transition-colors duration-300 text-sm">
              +91 900 661 3222
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-gray-800">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} World Green Line. All rights reserved.
          <span className="block sm:inline mt-1 sm:mt-0 sm:ml-4 ">
            Designed with ♥ in India
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;