import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@salescout/database';

// Load environment variables
dotenv.config();

// Controllers
import authController from './controllers/authController';

// Middleware
import { authenticate, requireOrganizer, requireAdmin } from './middleware/auth';

// Routes
import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend service is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Protected routes
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ message: 'Protected route accessed', user: (req as any).user });
});

// Organizer protected routes
app.get('/api/organizer/dashboard', authenticate, requireOrganizer, (req, res) => {
  res.json({ message: 'Organizer dashboard accessed', user: (req as any).user });
});

// Admin protected routes
app.get('/api/admin/stats', authenticate, requireAdmin, (req, res) => {
  res.json({ message: 'Admin stats accessed', user: (req as any).user });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
