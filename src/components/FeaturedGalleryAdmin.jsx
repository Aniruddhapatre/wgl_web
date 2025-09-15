import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, Video, Image, Loader2, File, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE;

// Supported file types
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
  'image/svg+xml', 'image/tiff', 'image/bmp', 'image/x-icon'
];

const SUPPORTED_VIDEO_TYPES = [
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 
  'video/x-matroska', 'video/webm'
];

// Size limits
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;   // 10 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;  // 500 MB

export default function MediaGallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [galleryType, setGalleryType] = useState('empty'); // 'empty', 'image', 'video'
  const fileInputRef = useRef(null);

  const fetchMedia = async () => {
    setIsFetching(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/media`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 
          errorData.message || 
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();
      setMediaItems(Array.isArray(data) ? data : []);

      // Determine gallery type based on existing media
      if (data.length === 0) {
        setGalleryType('empty');
      } else {
        const firstItemType = getFileType(data[0]);
        setGalleryType(firstItemType === 'video' ? 'video' : 'image');
      }

    } catch (err) {
      setError(err.message || 'Failed to load media.');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Check if files match the current gallery type
    if (galleryType !== 'empty') {
      const isTryingToUploadImage = files.some(file => 
        SUPPORTED_IMAGE_TYPES.includes(file.type)
      );
      const isTryingToUploadVideo = files.some(file => 
        SUPPORTED_VIDEO_TYPES.includes(file.type)
      );

      if (galleryType === 'image' && isTryingToUploadVideo) {
        setError('Cannot upload videos to an image gallery. Please delete all images first to upload videos.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (galleryType === 'video' && isTryingToUploadImage) {
        setError('Cannot upload images to a video gallery. Please delete all videos first to upload images.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    // Validate file type + size
    for (const file of files) {
      if (SUPPORTED_IMAGE_TYPES.includes(file.type) && file.size > MAX_IMAGE_SIZE) {
        setError(`Image "${file.name}" exceeds 10 MB limit.`);
        return;
      }
      if (SUPPORTED_VIDEO_TYPES.includes(file.type) && file.size > MAX_VIDEO_SIZE) {
        setError(`Video "${file.name}" exceeds 500 MB limit.`);
        return;
      }
      if (![...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES].includes(file.type)) {
        setError(`Unsupported file type: ${file.name}`);
        return;
      }
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('media', file);
      });

      const response = await fetch(`${API_BASE}/api/media`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 
          errorData.message || 
          `Upload failed: ${response.status}`
        );
      }

      const result = await response.json();
      const newItems = Array.isArray(result) ? result : [result];
      setMediaItems(prev => [...newItems, ...prev]);
      
      // Update gallery type based on what was uploaded
      if (galleryType === 'empty') {
        const uploadedType = SUPPORTED_VIDEO_TYPES.includes(files[0].type) ? 'video' : 'image';
        setGalleryType(uploadedType);
      }

    } catch (err) {
      setError(err.message || 'Failed to upload files.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (item) => {
    if (!item.public_id || !window.confirm('Are you sure you want to delete this media item?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/media/${encodeURIComponent(item.public_id)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 
          errorData.message || 
          `Delete failed: ${response.status}`
        );
      }

      // Update local state
      setMediaItems(prev => {
        const newItems = prev.filter(media => media.public_id !== item.public_id);
        
        // Update gallery type if all media is deleted
        if (newItems.length === 0) {
          setGalleryType('empty');
        }
        
        return newItems;
      });

    } catch (err) {
      setError(err.message || 'Failed to delete item.');
      // Re-fetch to ensure sync with server
      await fetchMedia();
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileType = (item) => {
    if (item.resource_type === 'video') return 'video';
    if (item.resource_type === 'image') return 'image';
    
    const extension = item.url?.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'tiff', 'bmp', 'ico'].includes(extension) 
      ? 'image' 
      : 'file';
  };

  const getAcceptTypes = () => {
    switch (galleryType) {
      case 'image':
        return SUPPORTED_IMAGE_TYPES.join(',');
      case 'video':
        return SUPPORTED_VIDEO_TYPES.join(',');
      case 'empty':
      default:
        return [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES].join(',');
    }
  };

  const getGalleryTypeMessage = () => {
    switch (galleryType) {
      case 'image':
        return 'Image Gallery - Only images can be uploaded';
      case 'video':
        return 'Video Gallery - Only videos can be uploaded';
      case 'empty':
      default:
        return 'Empty Gallery - Upload images or videos to begin';
    }
  };

  const getUploadDescription = () => {
    switch (galleryType) {
      case 'image':
        return 'Images only (JPEG, PNG, GIF, WEBP, SVG, TIFF, BMP, ICO) — max 10 MB';
      case 'video':
        return 'Videos only (MP4, MOV, AVI, MKV, WEBM) — max 500 MB';
      case 'empty':
      default:
        return 'Supports images (JPEG, PNG, GIF, WEBP, SVG, TIFF, BMP, ICO) — max 10 MB and videos (MP4, MOV, AVI, MKV, WEBM) — max 500 MB';
    }
  };

  return (
    <div className="text-white p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Media Gallery</h2>

      {error && (
        <div className="bg-red-500/90 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-white hover:text-gray-200"
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      )}

      {/* Gallery Type Indicator */}
      {mediaItems.length > 0 && (
        <div className="mb-4 p-3 bg-blue-900/30 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-blue-400" />
          <p className="text-sm">
            {getGalleryTypeMessage()}
          </p>
        </div>
      )}

      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={getAcceptTypes()}
          multiple
          disabled={isUploading || isFetching}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading || isFetching}
          className={`flex items-center px-4 py-2 rounded-md ${
            isUploading || isFetching
              ? "bg-blue-600/50 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
          aria-label="Upload media"
        >
          {(isUploading || isFetching) ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isUploading ? 'Uploading...' : 'Loading...'}
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload Media
            </>
          )}
        </button>
        <p className="text-sm text-gray-400 mt-2">
          {getUploadDescription()}
        </p>
      </div>

      {isFetching && mediaItems.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="bg-gray-800/50 rounded-lg p-8 text-center">
          <Image className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-300">No media items</h3>
          <p className="text-gray-400 mt-1">
            Upload your first image or video to get started
          </p>
        </div>
      ) : (
        <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item) => {
            const type = getFileType(item);
            return (
              <div
                key={item.public_id || item.url}
                className="relative group rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
              >
                {type === 'video' ? (
                  <div className="relative aspect-video bg-black">
                    <video
                      src={item.secure_url || item.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      controls
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-8 h-8 text-white/50" />
                    </div>
                  </div>
                ) : type === 'image' ? (
                  <img
                    src={item.secure_url || item.url}
                    alt="Media preview"
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center bg-gray-800">
                    <div className="text-center p-4">
                      <File className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-xs mt-2 text-gray-300 truncate">
                        {item.url?.split('/').pop()}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(item)}
                  disabled={isDeleting}
                  className={`absolute top-2 right-2 p-1.5 rounded-full ${
                    isDeleting
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } transition-opacity opacity-0 group-hover:opacity-100`}
                  aria-label={`Delete ${item.public_id}`}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-xs text-white truncate">
                    {(item.public_id || item.url?.split('/').pop()?.split('.')[0])}
                  </p>
                  <p className="text-xs text-gray-300">
                    {type} • {formatBytes(item.bytes)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0 || !bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}