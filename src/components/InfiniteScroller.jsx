// "use client";
// import React from "react";

// const InfiniteScroller = () => {
//   const logos = [
//     "forbes",
//     "adweek",
//     "pmi",
//     "wf",
//     "adweek",
//     "rd",
//     "pmi",
//     "webby",
//   ];

//   return (
//     <div
//       className="relative mt-8 mb-14 overflow-hidden w-full max-w-5xl mx-auto"
//       style={{
//         WebkitMaskImage:
//           "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0) 100%)",
//         maskImage:
//           "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0) 100%)",
//         WebkitMaskRepeat: "no-repeat",
//         WebkitMaskSize: "100% 100%",
//       }}
//     >
//       {/* Scrolling content */}
//       <div className="flex gap-12 animate-infinite-scroll">
//         {logos.concat(logos).map((logo, idx) => (
//           <img
//             key={idx}
//             src={`https://lazarev.kiev.ua/la24/${logo}.svg`}
//             alt={logo}
//             className="h-10 md:h-12 opacity-85 grayscale hover:grayscale-0 transition duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
//             style={{ filter: "brightness(0) invert(1)" }}
//           />
//         ))}
//       </div>

//       {/* Animation styles */}
//       <style>
//         {`
//           @keyframes infinite-scroll {
//             0% { transform: translateX(0); }
//             100% { transform: translateX(-50%); }
//           }
//           .animate-infinite-scroll {
//             display: flex;
//             width: max-content;
//             animation: infinite-scroll 14s linear infinite;
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default InfiniteScroller;


"use client";
import React from "react";

const InfiniteScroller = () => {
  const logos = [
    "ONGC.svg",
    "SHARC.png",
    "ON2.svg",
    "GJ2.svg",
    "ONGC.svg",
    "SHARC.png",
    "ON2.svg",
    "GJ2.svg",
    "ONGC.svg",
    "SHARC.png",
    "ON2.svg",
    "GJ2.svg",
    "ONGC.svg",
    "SHARC.png",
    "ON2.svg",
    "GJ2.svg",
  ];

  return (
    <>
      <h2 className="text-center text-3xl md:text-4xl font-bold tracking-wide text-lime-400 mb-8">
        Our Partners
      </h2>
    <div
      className="relative mt-12 mb-14 overflow-hidden w-full max-w-5xl mx-auto"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0) 100%)",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
      }}
    >
      {/* Scrolling content */}
      <div className="flex gap-12 animate-infinite-scroll">
        {logos.concat(logos).map((logo, idx) => (
          <img
            key={idx}
            src={`/images/pt/${logo}`}  
            alt={logo.split(".")[0]}
            className="h-14 md:h-24 opacity-85 grayscale hover:grayscale-0 transition duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        ))}
      </div>
      <style>
        {`
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            display: flex;
            width: max-content;
            animation: infinite-scroll 25s linear infinite;
          }
        `}
      </style>
    </div>
    </>
  );
};

export default InfiniteScroller;
