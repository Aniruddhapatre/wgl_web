const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Load environment variables properly
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Razorpay with proper error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
  });
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
  process.exit(1); // Exit if Razorpay can't be initialized
}

// Configure multer for file uploads
const storage = multer.diskStorage({
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

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
});

// Get EmailJS configuration with defaults
const getEmailJSConfig = () => ({
  serviceId: process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: process.env.EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY || ''
});

// Payment endpoints
app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'donation_receipt' } = req.body;
    const options = {
      amount: amount * 100,
      currency,
      receipt,
      payment_capture: 1
    };

    const response = await razorpay.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

app.post('/verify-payment', (req, res) => {
  res.json({ success: true });
});

// Form submission endpoint
app.post('/submit-application', upload.single('resume'), async (req, res) => {
  try {
    const { serviceId, templateId, publicKey } = getEmailJSConfig();
    
    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS configuration is incomplete');
    }

    const formData = {
      ...req.body,
      resumeName: req.file ? req.file.originalname : null,
      resumePath: req.file ? req.file.path : null
    };

    // Validate required fields
    const requiredFields = ['name', 'email', 'contact'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Prepare email data
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

    // Send email
    const emailResponse = await axios.post(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      }
    );

    res.json({ 
      success: true,
      message: 'Application submitted successfully!',
      data: {
        application: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact
        },
        emailStatus: emailResponse.status
      }
    });
  } catch (error) {
    console.error('Error processing application:', error);
    
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.error('Error deleting uploaded file:', fileError);
      }
    }
    
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error submitting application',
      error: error.response?.data || error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ 
      success: false,
      message: 'File upload error',
      error: err.message
    });
  } else {
    console.error('Server error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables:', {
    razorpay: process.env.RAZORPAY_KEY_ID ? 'configured' : 'missing',
    emailjs: getEmailJSConfig()
  });
});
