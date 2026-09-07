import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import { ENV } from '../config/env';

const router = Router();

// Configure Supabase Client for Persistent Cloud Storage
const isSupabaseConfigured = Boolean(
  ENV.SUPABASE.URL && ENV.SUPABASE.SERVICE_ROLE_KEY
);
const supabase = isSupabaseConfigured
  ? createClient(ENV.SUPABASE.URL, ENV.SUPABASE.SERVICE_ROLE_KEY)
  : null;

// Configure Cloudinary if credentials are provided
const isCloudinaryConfigured = Boolean(
  ENV.CLOUDINARY.CLOUD_NAME &&
  ENV.CLOUDINARY.API_KEY &&
  ENV.CLOUDINARY.API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY.CLOUD_NAME,
    api_key: ENV.CLOUDINARY.API_KEY,
    api_secret: ENV.CLOUDINARY.API_SECRET,
  });
}


const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter,
});

// Single Photo Upload with error handling & Cloudinary persistent storage
router.post('/', (req: Request, res: Response): void => {
  upload.single('photo')(req, res, async (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File size exceeds maximum allowed limit of 5MB.' });
        return;
      }
      res.status(400).json({ error: `Upload error: ${err.message}` });
      return;
    } else if (err) {
      res.status(400).json({ error: err.message || 'Invalid file uploaded.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded.' });
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        // Upload to Supabase Storage for persistent production cloud storage
        const fileBuffer = fs.readFileSync(req.file.path);
        const bucketName = ENV.SUPABASE.STORAGE_BUCKET || 'pashusetu-photos';
        const uniqueFileName = `livestock/${req.file.filename}`;

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from(bucketName)
          .upload(uniqueFileName, fileBuffer, {
            contentType: req.file.mimetype,
            upsert: true,
          });

        if (uploadErr) {
          console.warn('Supabase storage upload error, attempting fallback:', uploadErr.message);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(uniqueFileName);

          // Clean up local temp file
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkErr) {}

          res.status(201).json({
            url: publicUrlData.publicUrl,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype,
            storage: 'supabase',
          });
          return;
        }
      }

      if (isCloudinaryConfigured) {
        // Upload to Cloudinary for persistent production cloud storage
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'pashusetu_livestock',
          resource_type: 'image',
        });

        // Clean up local temp file
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          // Ignore temp cleanup errors
        }

        res.status(201).json({
          url: result.secure_url,
          filename: result.public_id,
          size: req.file.size,
          mimetype: req.file.mimetype,
          storage: 'cloudinary',
        });
        return;
      }

      // Fallback: local disk storage with dynamic domain (Railway, Render, or Localhost)
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.get('host') || 'localhost:5000';
      const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;


      res.status(201).json({
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        storage: 'local',
      });
    } catch (uploadError: any) {
      console.error('File storage upload error:', uploadError);
      res.status(500).json({ error: uploadError.message || 'Failed to process file storage' });
    }
  });
});

export default router;

