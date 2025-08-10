// import React, { useState, useRef, useEffect } from "react";
// import { Upload, Trash2, Video } from "lucide-react";
// import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary";

// export default function FeaturedGalleryAdmin() {
//   const [mediaItems, setMediaItems] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const savedMedia = localStorage.getItem("mediaItems");
//     if (savedMedia) setMediaItems(JSON.parse(savedMedia));
//   }, []);

//   const handleFileChange = async (event) => {
//     const files = event.target.files;
//     if (!files || files.length === 0) return;

//     setIsUploading(true);
//     setError(null);

//     try {
//       const uploaded = [];
//       for (const file of files) {
//         const result = await uploadToCloudinary(file);
//         uploaded.push({
//           type: result.type,
//           url: result.url,
//           public_id: result.public_id,
//           alt: file.name,
//         });
//       }
//       const updated = [...mediaItems, ...uploaded];
//       setMediaItems(updated);
//       localStorage.setItem("mediaItems", JSON.stringify(updated));
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsUploading(false);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   const handleDelete = async (publicId) => {
//     try {
//       await deleteFromCloudinary(publicId);
//       const updated = mediaItems.filter((item) => item.public_id !== publicId);
//       setMediaItems(updated);
//       localStorage.setItem("mediaItems", JSON.stringify(updated));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="text-white p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Admin Gallery Management</h2>

//       {error && <div className="bg-red-500 p-2 mb-3 rounded">{error}</div>}

//       {/* Upload */}
//       <div className="mb-4">
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="hidden"
//           accept="image/*,video/mp4"
//           multiple
//         />
//         <button
//           onClick={() => fileInputRef.current.click()}
//           disabled={isUploading}
//           className="flex items-center bg-green-600 px-4 py-2 rounded hover:bg-green-700"
//         >
//           <Upload size={20} className="mr-2" />
//           {isUploading ? "Uploading..." : "Upload Media"}
//         </button>
//       </div>

//       {/* Gallery List */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         {mediaItems.map((item, idx) => (
//           <div key={idx} className="relative border rounded overflow-hidden">
//             {item.type === "image" ? (
//               <img
//                 src={item.url}
//                 alt={item.alt}
//                 className="w-full h-40 object-cover"
//               />
//             ) : (
//               <video src={item.url} className="w-full h-40 object-cover" controls />
//             )}
//             <button
//               onClick={() => handleDelete(item.public_id)}
//               className="absolute top-2 right-2 bg-red-600 p-1 rounded hover:bg-red-700"
//             >
//               <Trash2 size={18} />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import React, { useState, useRef, useEffect } from "react";
import { Upload, Trash2, Video, Image, Loader2 } from "lucide-react";
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary";

export default function FeaturedGalleryAdmin() {
  const [mediaItems, setMediaItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Load media items from localStorage
  useEffect(() => {
    const loadMedia = () => {
      try {
        const savedMedia = localStorage.getItem("mediaItems");
        if (savedMedia) {
          const parsed = JSON.parse(savedMedia);
          if (Array.isArray(parsed)) {
            setMediaItems(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to load media:", err);
      }
    };
    loadMedia();
  }, []);

  // Handle file upload
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          try {
            return await uploadToCloudinary(file);
          } catch (err) {
            console.error(`Failed to upload ${file.name}:`, err);
            return null;
          }
        })
      );

      const successfulUploads = uploadResults.filter(Boolean);
      if (successfulUploads.length) {
        const updatedItems = [...mediaItems, ...successfulUploads];
        setMediaItems(updatedItems);
        localStorage.setItem("mediaItems", JSON.stringify(updatedItems));
      }

      if (successfulUploads.length !== files.length) {
        setError(
          `Some files failed to upload (${
            files.length - successfulUploads.length
          } of ${files.length})`
        );
      }
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle media deletion
  const handleDelete = async (publicId, resourceType) => {
    if (!publicId) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteFromCloudinary(publicId, resourceType);
      const updatedItems = mediaItems.filter(
        (item) => item.public_id !== publicId
      );
      setMediaItems(updatedItems);
      localStorage.setItem("mediaItems", JSON.stringify(updatedItems));
    } catch (err) {
      setError(err.message || "Deletion failed");
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="text-white p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Media Library</h2>

      {error && (
        <div className="bg-red-500/90 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-white hover:text-gray-200"
          >
            &times;
          </button>
        </div>
      )}

      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*"
          multiple
          disabled={isUploading}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
          className={`flex items-center px-4 py-2 rounded-md ${
            isUploading
              ? "bg-blue-600/50 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload Media
            </>
          )}
        </button>
        <p className="text-sm text-gray-400 mt-2">
          Supports images and videos (max 100MB)
        </p>
      </div>

      {mediaItems.length === 0 ? (
        <div className="bg-gray-800/50 rounded-lg p-8 text-center">
          <Image className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-300">No media items</h3>
          <p className="text-gray-400 mt-1">
            Upload your first image or video to get started
          </p>
        </div>
      ) : (
        <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item) => (
            <div
              key={item.public_id}
              className="relative group rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
            >
              {item.type === "video" ? (
                <div className="relative aspect-video bg-black">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-8 h-8 text-white/50" />
                  </div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt=""
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              )}

              <button
                onClick={() => handleDelete(item.public_id, item.type)}
                disabled={isDeleting}
                className={`absolute top-2 right-2 p-1.5 rounded-full ${
                  isDeleting
                    ? "bg-gray-600 cursor-wait"
                    : "bg-red-600 hover:bg-red-700"
                } transition-opacity opacity-0 group-hover:opacity-100`}
                aria-label="Delete media"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-xs text-white truncate">
                  {item.public_id.split("/").pop()}
                </p>
                <p className="text-xs text-gray-300">
                  {item.type} • {formatBytes(item.bytes)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to format file size
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

