import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, Video, Image, Loader2, File } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE ;

// Supported file types
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
  'image/svg+xml', 'image/tiff', 'image/bmp', 'image/x-icon'
];

const SUPPORTED_VIDEO_TYPES = [
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 
  'video/x-matroska', 'video/webm'
];

export default function MediaGallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const fetchMedia = async () => {
    setIsFetching(true);
    setError(null);
    
    try {
      console.log('Fetching media from:', `${API_BASE}/api/media`);
      const response = await fetch(`${API_BASE}/api/media`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(
          errorData.error || 
          errorData.message || 
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();
      console.log('Received media items:', data.length);
      setMediaItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error details:', {
        message: err.message,
        stack: err.stack
      });
      setError(err.message || 'Failed to load media. Please check the console for details.');
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

    // Validate file types
    const invalidFiles = files.filter(file => 
      ![...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES].includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError(`Unsupported file types: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const IMAGE_LIMIT = 10 * 1024 * 1024;   // 10 MB
      const VIDEO_LIMIT = 500 * 1024 * 1024;  // 500 MB

      const formData = new FormData();
      files.forEach(file => {
        if (SUPPORTED_IMAGE_TYPES.includes(file.type) && file.size > IMAGE_LIMIT) {
          throw new Error(`Image ${file.name} exceeds 10MB limit`);
        }
        if (SUPPORTED_VIDEO_TYPES.includes(file.type) && file.size > VIDEO_LIMIT) {
          throw new Error(`Video ${file.name} exceeds 500MB limit`);
        }
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
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload files. Please check the format and size (max 10MB for images, 500MB for videos).');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (publicId) => {
    if (!publicId || !window.confirm('Are you sure you want to delete this media item?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/media/${encodeURIComponent(publicId)}`, {
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

      await fetchMedia();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileType = (item) => {
    if (item.resource_type === 'video') return 'video';
    const extension = item.url.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'tiff', 'bmp', 'ico'].includes(extension) 
      ? 'image' 
      : 'file';
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

      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={[...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES].join(',')}
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
          Supports images (JPEG, PNG, GIF, WEBP, SVG, TIFF, BMP, ICO) up to 10MB <br />
          and videos (MP4, MOV, AVI, MKV, WEBM) up to 500MB
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
                        {item.url.split('/').pop()}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(item.public_id)}
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
                    {(item.public_id || item.url.split('/').pop().split('.')[0])}
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
