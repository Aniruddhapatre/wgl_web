"use client";
import { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    const loader = document.getElementById("loader");
    const body = document.body;

    // Disable scroll
    body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      if (loader) loader.style.top = "-100%";

      // Re-enable scroll
      body.style.overflow = "auto";
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div id="loader">
        <h1 className="delay1">Before It's Gone</h1>
        <h1 className="delay2">Act With Heart</h1>
        
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }

        #loader {
          height: 100%;
          width: 100%;
          background-color: #000;
          position: fixed;
          z-index: 9999;
          top: 0;
          left: 0;
          transition: top 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
          padding: 0 1rem;
           flex-direction: column;
        }

        #loader h1 {
          font-size: 4vw;
          color: transparent;
          background: linear-gradient(
            90deg,
            rgba(225, 224, 228, 1) 0%,
            rgb(18, 109, 8) 35%,
            rgb(0, 255, 157) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          position: absolute;
          opacity: 0;
          animation: fadeInOut 1s linear forwards;
        }

        #loader h1.delay1 { animation-delay: 1s; }
        #loader h1.delay2 { animation-delay: 2s; }
       

        @media (max-width: 600px) {
          #loader h1 {
            font-size: 40px;
            line-height: 1;
          }
        }
      `}</style>
    </>
  );
}
