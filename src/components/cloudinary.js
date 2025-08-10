// export const uploadToCloudinary = async (file) => {
//   // Validate environment variables first
//   const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//   const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

//   if (!cloudName || !uploadPreset) {
//     throw new Error('Cloudinary configuration is missing');
//   }

//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('upload_preset', uploadPreset);

//   try {
//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudName}/${
//         file.type.startsWith('video/') ? 'video' : 'image'
//       }/upload`,
//       {
//         method: 'POST',
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Upload failed');
//     }

//     const data = await response.json();
//     return {
//       url: data.secure_url,
//       public_id: data.public_id,
//       type: file.type.startsWith('video/') ? 'video' : 'image',
//     };
//   } catch (error) {
//     console.error('Detailed upload error:', error);
//     throw new Error(`Upload failed: ${error.message}`);
//   }
// };

// export const deleteFromCloudinary = async (publicId) => {
//   try {
//     // Validate input
//     if (!publicId || typeof publicId !== 'string') {
//       throw new Error('Invalid public_id');
//     }

//     // Cloudinary configuration
//     const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//     const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    
//     if (!cloudName || !apiKey) {
//       throw new Error('Cloudinary configuration missing');
//     }

//     // Create form data with required parameters
//     const formData = new FormData();
//     formData.append('public_id', publicId);
//     formData.append('api_key', apiKey);

//     // Add timestamp and signature for authentication
//     const timestamp = Math.floor(Date.now() / 1000);
//     formData.append('timestamp', timestamp.toString());

//     // Note: For client-side deletion, you'll need to either:
//     // 1. Use an unsigned preset that allows deletion
//     // 2. Create a backend API endpoint for secure deletion (recommended)

//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
//       {
//         method: 'POST',
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error?.message || 'Deletion failed');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Detailed deletion error:', error);
//     throw new Error(`Deletion failed: ${error.message}`);
//   }
// };


// cloudinary.js
export const uploadToCloudinary = async (file) => {
  // Validate environment variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('cloud_name', cloudName);

  try {
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      public_id: data.public_id,
      type: resourceType,
      format: data.format,
      width: data.width,
      height: data.height,
      bytes: data.bytes,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    // Validate input
    if (!publicId || typeof publicId !== 'string') {
      throw new Error('Invalid public_id');
    }

    // Cloudinary configuration
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    
    if (!cloudName || !apiKey) {
      throw new Error('Cloudinary configuration missing');
    }

    // For client-side deletion, we need to use a signed request
    // This requires either:
    // 1. Using an unsigned preset that allows deletion (not recommended for production)
    // 2. Creating a backend API endpoint to handle secure deletion (recommended)

    // Here's the client-side approach (for development only)
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(publicId, timestamp);

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Deletion failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Deletion error:', error);
    throw new Error(`Deletion failed: ${error.message}`);
  }
};

// Helper function to generate signature (client-side implementation)
// Note: In production, this should be done server-side
const generateSignature = async (publicId, timestamp) => {
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;
  
  if (!apiSecret) {
    throw new Error('API secret is required for signing');
  }

  // Create the string to sign
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  
  // Use the Web Crypto API for SHA-256 hashing
  const msgBuffer = new TextEncoder().encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};