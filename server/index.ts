import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file provided' });
    return;
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

app.post('/api/generate-voice', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'No prompt provided' });
      return;
    }
    // TODO: Implement Bark API integration
    // For now, return a mock response
    res.json({ audioUrl: 'https://example.com/mock-audio.mp3' });
  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({ error: 'Failed to generate voice' });
  }
});

app.post('/api/animate', async (req, res) => {
  try {
    const { imageUrl, audioUrl } = req.body;
    if (!imageUrl || !audioUrl) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }
    // TODO: Implement D-ID API integration
    // For now, return a mock response
    res.json({ videoUrl: 'https://example.com/mock-video.mp4' });
  } catch (error) {
    console.error('Animation error:', error);
    res.status(500).json({ error: 'Failed to create animation' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 