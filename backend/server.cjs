const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const serverless = require("serverless-http");




const app = express();

app.get("/", (req, res) => {
  res.send("Backend is running on Vercel 🚀");
});

module.exports = app;
module.exports.handler = serverless(app);


// ===================
// Configurations
// ===================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Razorpay
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
  });
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
  process.exit(1);
}

// Cloudinary
try {
  cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log('Cloudinary configured successfully');
} catch (error) {
  console.error('Cloudinary configuration failed:', error);
  process.exit(1);
}

const CLOUDINARY_MEDIA_FOLDER = 'media_gallery';
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'wgl_images';

// Multer for documents
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const docUpload = multer({ storage: docStorage });

// Multer for media
const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 
      'video/mp4', 'video/quicktime', 'video/x-msvideo'
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type.'));
  }
});

// EmailJS config
const getEmailJSConfig = () => ({
  serviceId: process.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: process.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.VITE_EMAILJS_PUBLIC_KEY || ''
});

// ===================
// Razorpay Endpoints
// ===================
app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'donation_receipt' } = req.body;
    const options = { amount: amount * 100, currency, receipt, payment_capture: 1 };
    const response = await razorpay.orders.create(options);
    res.json({ id: response.id, currency: response.currency, amount: response.amount });
  } catch (error) {
    res.status(500).json({ error: 'Error creating order' });
  }
});

app.post('/verify-payment', (req, res) => {
  res.json({ success: true });
});

// ===================
// Application Endpoint
// ===================
app.post('/submit-application', docUpload.single('resume'), async (req, res) => {
  try {
    const { serviceId, templateId, publicKey } = getEmailJSConfig();
    if (!serviceId || !templateId || !publicKey) throw new Error('EmailJS config missing');

    const formData = { ...req.body, resumeName: req.file?.originalname, resumePath: req.file?.path };
    const requiredFields = ['name', 'email', 'contact'];
    const missingFields = requiredFields.filter(f => !formData[f]);
    if (missingFields.length > 0) throw new Error(`Missing fields: ${missingFields.join(', ')}`);

    const templateParams = {
      opportunity_type: formData.opportunityType || 'Not specified',
      applicant_name: formData.name,
      email: formData.email,
      contact_number: formData.contact,
      location: formData.location || 'Not provided',
      duration: formData.duration || 'Not specified',
      reason: formData.reason || 'Not provided',
      experience: formData.experience || 'Not provided',
      resume: formData.resumeName || 'Not attached',
      submission_date: new Date().toLocaleString()
    };

    await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams
    });

    res.json({ success: true, message: 'Application submitted!' });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===================
// Media Gallery Endpoints
// ===================
app.get('/api/media', async (req, res) => {
  try {
    console.log('Fetching media from Cloudinary...');
    const [images, videos] = await Promise.all([
      cloudinary.api.resources({ type: 'upload', prefix: `${CLOUDINARY_MEDIA_FOLDER}/`, max_results: 500, resource_type: 'image' }),
      cloudinary.api.resources({ type: 'upload', prefix: `${CLOUDINARY_MEDIA_FOLDER}/`, max_results: 500, resource_type: 'video' })
    ]);

    const allMedia = [...images.resources, ...videos.resources];
    res.json(allMedia.map(item => ({
      url: item.secure_url,
      type: item.resource_type,
      public_id: item.public_id,
      bytes: item.bytes,
      created_at: item.created_at
    })));
  } catch (err) {
    console.error('Cloudinary API error:', err);
    res.status(500).json({ error: 'Failed to fetch media', details: err.message });
  }
});

app.post('/api/media', mediaUpload.array('media', 10), async (req, res) => {
  try {
    if (!req.files.length) return res.status(400).json({ error: 'No files uploaded' });

    const uploadResults = await Promise.all(req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: file.mimetype.startsWith('video') ? 'video' : 'image', folder: CLOUDINARY_MEDIA_FOLDER, upload_preset: UPLOAD_PRESET, use_filename: true, unique_filename: true },
          (error, result) => error ? reject(error) : resolve(result)
        ).end(file.buffer);
      });
    }));

    res.status(201).json(uploadResults);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

app.delete('/api/media/:public_id', async (req, res) => {
  try {
    if (!req.params.public_id) return res.status(400).json({ error: 'Missing public_id' });

    const result = await cloudinary.uploader.destroy(req.params.public_id, { resource_type: 'image', invalidate: true });
    if (result.result !== 'ok') throw new Error(result.result || 'Unknown deletion error');

    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete media', details: err.message });
  }
});

// ===================
// Health Check
// ===================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      cloudinary: !!cloudinary.config().api_key,
      razorpay: !!process.env.RAZORPAY_KEY_ID,
      emailjs: !!process.env.VITE_EMAILJS_SERVICE_ID
    }
  });
});

// Error Handling
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
