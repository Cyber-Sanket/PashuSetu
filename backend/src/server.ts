import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env';

// Route Imports
import authRoutes from './routes/auth.routes';
import animalRoutes from './routes/animals.routes';
import reportRoutes from './routes/reports.routes';
import caseRoutes from './routes/cases.routes';
import treatmentRoutes from './routes/treatments.routes';
import vaccinationRoutes from './routes/vaccinations.routes';
import sampleRoutes from './routes/samples.routes';
import governmentRoutes from './routes/government.routes';
import advisoryRoutes from './routes/advisories.routes';
import notificationRoutes from './routes/notifications.routes';
import vetServiceRoutes from './routes/vet-services.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();

// Trust proxy for secure cookies and https protocol detection on Render/Railway
app.set('trust proxy', 1);

// Production-ready CORS Configuration
const allowedOrigins = [
  ENV.FRONTEND_URL,
  ENV.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      // Check against explicit allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Automatically allow Netlify deploy previews and production Netlify domains
      if (/\.netlify\.app$/.test(origin)) {
        return callback(null, true);
      }

      // In non-production, allow all localhost ports
      if (ENV.NODE_ENV !== 'production' && origin.includes('localhost')) {
        return callback(null, true);
      }

      // Default: allow origin dynamically for seamless demo hosting
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for file uploads / demo assets
const uploadsDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// Health Check Endpoint (Production verification)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PashuSetu API',
    version: '1.0.0',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
    sihProblemStatement: 'SIH26128',
    department: 'Department of Animal Husbandry, Government of Maharashtra',
  });
});


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/samples', sampleRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/vet-services', vetServiceRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(ENV.PORT, () => {
  console.log(`====================================================`);
  console.log(` PashuSetu Backend Server running on port ${ENV.PORT}`);
  console.log(` Environment: ${ENV.NODE_ENV}`);
  console.log(` Health check: http://localhost:${ENV.PORT}/api/health`);
  console.log(`====================================================`);
});
