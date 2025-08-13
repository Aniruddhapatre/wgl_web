import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const testimonialData = [
  {
    type: "img",
    src: "https://cdn.dribbble.com/uploads/47172/original/d85ae8c7db2421e9a01ecac942978d4b.png?1685645079&format=webp&resize=400x498&vertical=center",
    name: "Andrea Jelic",
    testimonial:
      "Their support changed our village's future. We now have hope, clean water, and unity.",
    tags: ["IT", "UI", "Web"],
  },
  {
    type: "video",
    src: "https://cdn.dribbble.com/uploads/47181/original/1e3a73a174484bef522b620c401cd00a.mp4?1685645427",
    name: "Jesse Showalter",
    testimonial:
      "Amazing guidance and professional support throughout the journey.",
    tags: ["CHANGE MANAGEMENT", "Web", "Mobile"],
  },
  {
    type: "img",
    src: "https://cdn.dribbble.com/uploads/47171/original/daniele-buffa-3.png?1689174763&format=webp&resize=400x498&vertical=center",
    name: "Daniele Buffa",
    testimonial: "Working with them made everything smooth and successful.",
    tags: ["Animation", "UI", "Visual"],
  },
  {
    type: "video",
    src: "video/test2.mp4",
    name: "Rahul Sharma",
    testimonial: "The training transformed our technical skills completely.",
    tags: ["TECHNOLOGY", "Education"],
  },
  {
    type: "video",
    src: "video/test1.mp4",
    name: "Victa Wille",
    testimonial: "Great collaboration and timely delivery of creative work.",
    tags: ["Mobile", "UI", "Web"],
  },
  {
    type: "video",
    src: "https://www.shutterstock.com/shutterstock/videos/1109539465/preview/stock-footage-ponkh-rajasthan-india-october-a-group-of-cheerful-young-indian-rural-boys-and-girls-or.webm",
    name: "Priya Patel",
    testimonial: "Our community has never been more empowered.",
    tags: ["COMMUNITY", "Development"],
  },
  {
    type: "img",
    src: "https://cdn.dribbble.com/uploads/47178/original/mercedes-bazan.png?1689174566&format=webp&resize=400x498&vertical=center",
    name: "Mercedes Bazan",
    testimonial: "A talented team that delivered beyond expectations.",
    tags: ["Graphic Design", "Illustration"],
  },
  {
    type: "video",
    src: "https://www.shutterstock.com/shutterstock/videos/3462018801/preview/stock-footage--bilaspur-chhattisgarh-india-an-indian-old-man-standing-with-stick-in-his-hand-and.webm",
    name: "Arjun Das",
    testimonial: "This program gave me skills I never thought I could learn.",
    tags: ["EDUCATION", "Empowerment"],
  },
];

const ReviewsPage = () => {
  const swiperRef = useRef(null);
  const videoRef = useRef(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

  const [isMuted, setIsMuted] = useState(true); // default muted
  const [isPlaying, setIsPlaying] = useState(false);

  // lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [selectedItem]);

  // Attach video event listeners (play/pause/volumechange) whenever modal mounts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      setIsMuted(video.muted);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, [selectedItem]); // runs after modal (and video element) is in DOM

  // When selectedItem (modal) changes, set video props and try to autoplay (muted will allow autoplay)
  useEffect(() => {
    const video = videoRef.current;
    if (!selectedItem || !video) return;

    video.muted = isMuted;

    // try to play (may be blocked if unmuted)
    const p = video.play();
    if (p && typeof p.then === "function") {
      p.then(() => setIsPlaying(true)).catch((err) => {
        // Autoplay might fail if unmuted — keep muted or wait for user gesture
        console.warn("Autoplay prevented:", err);
        setIsPlaying(!video.paused);
      });
    }
  }, [selectedItem, isMuted]);

  const handleCardHover = (index) => {
    setHoveredCardIndex(index);
    if (swiperRef.current) swiperRef.current.autoplay.stop();
  };

  const handleCardLeave = () => {
    setHoveredCardIndex(null);
    if (swiperRef.current && !selectedItem) swiperRef.current.autoplay.start();
  };

  const openVideoModal = (item) => {
    if (item.type !== "video") return;
    setSelectedItem(item);
    setIsMuted(true); // default to muted so autoplay works
    if (swiperRef.current) swiperRef.current.autoplay.stop();
  };

  const closeModal = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (e) {}
    }
    setSelectedItem(null);
    if (swiperRef.current && hoveredCardIndex === null) swiperRef.current.autoplay.start();
  };

  const togglePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (e) {
        console.warn("Play blocked:", e);
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <section id="reviews" className="py-16 px-4 sm:px-16 text-white">
      <div className="text-center max-w-6xl mx-auto">
        <h2 className="text-3xl text-lime-300 font-bold mb-2">
          What people say about us
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto">
          Hear directly from the people whose lives have been impacted by our
          initiatives.
        </p>
        <div className="w-20 h-1 bg-lime-300 mt-4 mx-auto rounded-full" />

        <div
          className="pt-8"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          }}
        >
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            loop={true}
            speed={900}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            spaceBetween={20}
            slidesPerView="auto"
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 40 },
            }}
            className="pb-10 pl-4"
          >
            {testimonialData.map((item, index) => (
              <SwiperSlide
                key={index}
                className="w-[300px] sm:w-[360px] flex justify-center"
                onMouseEnter={() => handleCardHover(index)}
                onMouseLeave={handleCardLeave}
              >
                <div
                  onClick={() => openVideoModal(item)}
                  className={`rounded-3xl  select-none overflow-hidden w-full sm:w-[360px] h-[400px] sm:h-[440px] relative bg-gradient-to-br from-zinc-800 via-zinc-900 to-black  group transition-all duration-300 hover:border-2 hover:border-lime-300 ${
                    item.type === "video" ? "cursor-pointer" : ""
                  }`}
                >
                  {item.type === "img" ? (
                    <img
                      src={item.src}
                      alt={item.name}
                      className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition duration-300"
                    />
                  ) : (
                    // small preview autoplay muted in card (OK bc it's muted)
                    <video
                      src={item.src}
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition duration-300"
                    />
                  )}

                  {/* <div className="absolute top-3 left-3 px-3 py-1 text-[11px] bg-emerald-300 text-black font-semibold rounded-full shadow">
                    {item.tags[0]}
                  </div> */}

                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white backdrop-blur-sm">
                    <p className="text-sm font-light italic text-gray-200 leading-snug mb-3">
                      "{item.testimonial}"
                    </p>
                    <div className="flex flex-col gap-[2px]">
                      <h5 className="text-[14px] font-semibold tracking-wide">
                        {item.name}
                      </h5>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {item.tags.slice(0).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-white/10 text-white text-[10px] px-2 py-[1px] rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Video Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div className="relative h-[80vh] w-[calc(80vh*9/16)] max-w-[90vw]">
            {/* Controls top-right */}
            <div className="absolute top-4 right-4 z-50 flex gap-2 items-center">
              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="text-white bg-black/50 rounded-full p-2 flex items-center justify-center hover:bg-black/70 transition"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  // pause icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1zm8 0a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z" />
                  </svg>
                ) : (
                  // play icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4.5 3.5v13l11-6.5-11-6.5z" />
                  </svg>
                )}
              </button>

              {/* Mute toggle */}
              <button
                onClick={toggleMute}
                className="text-white bg-black/50 rounded-full p-2 flex items-center justify-center hover:bg-black/70 transition"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  // Muted icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  // Unmuted icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              {/* Close */}
              <button
                onClick={closeModal}
                className="text-white bg-black/50 rounded-full p-2 flex items-center justify-center hover:bg-black/70 transition"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>

            {/* Actual video */}
            <video
              ref={videoRef}
              src={selectedItem.src}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover rounded-lg"
              onClick={togglePlayPause}
            />

            {/* Bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {selectedItem.name.charAt(0)}
                  </span>
                </div>
                <span className="font-semibold text-white">{selectedItem.name}</span>
              </div>
              <p className="text-white text-sm mb-2 line-clamp-2">
                {selectedItem.testimonial}
              </p>
              <div className="flex gap-2 flex-wrap">
                {selectedItem.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                    #{tag.toLowerCase().replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsPage;