import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the correct path - now using absolute path resolution
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import saleRoutes from './routes/sales';
import itemRoutes from './routes/items';
import favoriteRoutes from './routes/favorites';
import userRoutes from './routes/users';
import stripeRoutes from './routes/stripe';
import notificationRoutes from './routes/notifications';
import affiliateRoutes from './routes/affiliate';
import lineRoutes from './routes/lines';
import { authenticate } from './middleware/auth';
import { PrismaClient } from '@prisma/client';
import './jobs/auctionJob';
import './jobs/notificationJob';

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'SaleScout API is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/lines', lineRoutes);

// Protected route example
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: (req as any).user });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Log environment variables status for debugging
  console.log('Environment variables status:');
  console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Present' : '❌ Missing');
  console.log('- TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Present' : '❌ Missing');
  console.log('- TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Present' : '❌ Missing');
});
