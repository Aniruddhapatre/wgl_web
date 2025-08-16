import { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { resourcesLinks, platformLinks } from "../constants";
import logo from "/images/logo.svg";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const Footer = () => {
  const [openPDF, setOpenPDF] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const pdfFiles = {
    privacy: "/docs/Privacy Policy.pdf",
    terms: "/docs/Donation T&C.pdf",
    fraud: "/docs/Refund Policy.pdf",
    cookies: "/docs/Cookies Policy.pdf",
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (openPDF) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openPDF]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <footer className="text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-lime-500">
      {/* Footer Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-24 h-16 scale-[1.2]" />
            <span className="text-xl font-bold text-lime-400">
              World Green Line
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Making sustainability smarter with AI. Clean, green, and connected —
            that's our mission.
          </p>
          <div className="flex mt-2 gap-4">
            <a
              href="https://www.facebook.com/worldgreenline.org/"
              className="text-gray-400 hover:text-lime-400"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://twitter.com/worldgreenline"
              className="text-gray-400 hover:text-lime-400"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://www.instagram.com/worldgreenline_org/"
              className="text-gray-400 hover:text-lime-400"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/worldgreenline/"
              className="text-gray-400 hover:text-lime-400"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-5 pb-2 border-b border-lime-500/30 inline-block">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {platformLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-gray-400 hover:text-lime-400 flex items-start gap-2"
                >
                  <span className="mt-0.5">•</span> <span>{link.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-5 pb-2 border-b border-lime-500/30 inline-block">
            Resources
          </h3>
          <ul className="space-y-3">
            {resourcesLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-gray-400 hover:text-lime-400 flex items-start gap-2"
                >
                  <span className="mt-0.5">•</span> <span>{link.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold mb-5 pb-2 border-b border-lime-500/30 inline-block">
            Contact Us
          </h3>
          <div className="flex items-start gap-3">
            <MapPin className="text-lime-400 w-5 h-5" />
            <address className="text-gray-400 text-sm not-italic">
              Shiv Shakti Nagar, Near Shiv Mandir
              <br />
              Chas, Bokaro, Jharkhand
              <br /> India - 827013
            </address>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="text-lime-400 w-5 h-5" />
            <a
              href="mailto:info@worldgreenline.org"
              className="text-gray-400 hover:text-lime-400 text-sm"
            >
              info@worldgreenline.org
            </a>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="text-lime-400 w-5 h-5" />
            <a
              href="tel:+91 9006613222"
              className="text-gray-400 hover:text-lime-400 text-sm"
            >
              +91 900 661 3222
            </a>
          </div>
        </div>
      </div>

      {/* Copyright + Policies - Single Line Responsive */}
      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-gray-800">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-gray-500">
          <span>
            © {new Date().getFullYear()} World Green Line. All rights reserved.
          </span>
          {/* <span className="hidden sm:inline">|</span> */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm text-gray-500 mt-2 sm:mt-0">
            <button
              onClick={() => setOpenPDF("privacy")}
              className="hover:text-lime-400 whitespace-nowrap"
            >
              Privacy Policy
            </button>
            {/* <span className="hidden sm:inline">|</span> */}
            <button
              onClick={() => setOpenPDF("fraud")}
              className="hover:text-lime-400 whitespace-nowrap"
            >
              Fraud Policy
            </button>
            {/* <span className="hidden sm:inline">|</span> */}
            <button
              onClick={() => setOpenPDF("terms")}
              className="hover:text-lime-400 whitespace-nowrap"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setOpenPDF("cookies")}
              className="hover:text-lime-400 whitespace-nowrap"
            >
              Cookies Policy
            </button>
          </div>
          <span>Designed with ♥ in India</span>
        </div>
      </div>

      {/* PDF Popup */}
      {openPDF && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setOpenPDF(null)}
        >
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative flex flex-col">
            <div className="flex justify-between items-center p-4 border-b bg-gray-500">
              <h3 className="font-bold capitalize text-lg">
                {openPDF.replace("-", " ")}
              </h3>
              <button
                onClick={() => setOpenPDF(null)}
                className="text-gray-500 hover:text-gray-700 bg-white/70 hover:bg-white/100 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex justify-center overflow-x-hidden">
              <Document
                file={pdfFiles[openPDF]}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="text-center py-8">Loading document...</div>
                }
                error={
                  <div className="text-center py-8 text-red-500">
                    Failed to load document
                  </div>
                }
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={Math.min(800, window.innerWidth - 100)}
                    renderTextLayer={false} // optional: speeds up + cleaner
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
            </div>
            <div className="p-2 text-center text-sm text-gray-500 bg-gray-50">
              View-only document - Page{" "}
              {numPages ? `1 of ${numPages}` : "loading..."}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
