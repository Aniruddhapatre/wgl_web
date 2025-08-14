import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Leaf, Video, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function FeaturedProject() {
  const [mediaItems, setMediaItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("right");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate Cloudinary URLs
  const validateUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return url.startsWith('https://') && url.includes('res.cloudinary.com');
    } catch {
      return false;
    }
  };

  // Fetch media items from backend API
  const fetchMedia = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/api/media`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch media');
      }

      const data = await response.json();
      
      // Transform and validate media items
      const formattedMedia = data
        .map(item => ({
          url: item.secure_url || item.url,
          type: item.resource_type === 'video' ? 'video' : 'image',
          public_id: item.public_id,
          bytes: item.bytes,
          format: item.format
        }))
        .filter(item => validateUrl(item.url)); // Only keep items with valid URLs

      setMediaItems(formattedMedia);
      
      if (formattedMedia.length === 0) {
        setError('No valid media items found');
      }
    } catch (err) {
      console.error("Error fetching media:", err);
      setError(err.message || "Failed to load gallery. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const prevSlide = useCallback(() => {
    if (mediaItems.length === 0) return;
    setTransitionDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  }, [mediaItems.length]);

  const nextSlide = useCallback(() => {
    if (mediaItems.length <= 1) return;
    setTransitionDirection("right");
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  }, [mediaItems.length]);

  const goToSlide = (index) => {
    setTransitionDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Auto-slide only when there are valid items
  useEffect(() => {
    if (mediaItems.length <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, mediaItems.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px] md:h-[550px]">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  return (
    <div className="text-white px-4 sm:px-12 py-12 relative">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded shadow-lg flex items-center gap-3">
          <span>{error}</span>
          <button 
            onClick={fetchMedia}
            className="px-2 py-1 bg-white text-red-500 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-5 w-full">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Leaf className="text-green-600" size={32} />
            <h1 className="text-3xl sm:text-4xl font-bold text-lime-300">
              Daily Glimpses of World Green Line
            </h1>
          </div>
          <p className="text-gray-300 max-w-xl mx-auto">
            Documenting our conservation efforts across the globe.
          </p>
        </div>

        <div className="h-[400px] md:h-[550px] w-full relative group">
          <div className="w-full h-full rounded-2xl bg-black overflow-hidden shadow-2xl border-4 border-white relative">
            {mediaItems.length > 0 ? (
              mediaItems[currentIndex]?.type === "video" ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <video
                    src={mediaItems[currentIndex].url}
                    className="w-full h-full object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      console.error('Failed to load video:', mediaItems[currentIndex].url);
                    }}
                  />
                </div>
              ) : (
                <div
                  className={`w-full h-full ${
                    transitionDirection === "right"
                      ? "animate-slideInRight"
                      : "animate-slideInLeft"
                  }`}
                >
                  <img
                    src={mediaItems[currentIndex]?.url}
                    alt="Featured media content"
                    className="w-full h-full object-cover bg-black"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900 rounded-2xl">
                <p>No media to display.</p>
                <p className="text-sm text-gray-400">Please upload images or videos</p>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {mediaItems.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/70 text-white hover:bg-black/90 transition z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                onClick={nextSlide}
                className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/70 text-white hover:bg-black/90 transition z-10"
                aria-label="Next slide"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}

          {/* Thumbnail Navigation */}
          {mediaItems.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-xl p-2 flex gap-2 z-20 backdrop-blur-sm">
              {mediaItems.map((media, index) => (
                <div
                  key={media.public_id || index}
                  onClick={() => goToSlide(index)}
                  className={`cursor-pointer rounded-lg overflow-hidden transition-all border-2 shadow-md ${
                    currentIndex === index
                      ? "border-green-500 scale-110"
                      : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {media.type === "video" ? (
                    <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-gray-800">
                      <Video size={28} className="text-white" />
                    </div>
                  ) : (
                    <img
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-14 h-14 md:w-16 md:h-16 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-thumbnail.jpg';
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}