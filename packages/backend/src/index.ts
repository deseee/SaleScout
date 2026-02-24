import dotenv from 'dotenv';
dotenv.config();

// Check for required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set in environment variables. Check your .env file.');
  process.exit(1);
}
console.log('✅ Stripe secret key found.');

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';

// Import routes
import authRoutes from './routes/auth';
import saleRoutes from './routes/sales';
import itemRoutes from './routes/items';
import stripeRoutes from './routes/stripe';
import favoriteRoutes from './routes/favorites';
import userRoutes from './routes/users';

// Import jobs
import { endAuctions } from './jobs/auctionJob';

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Configure CORS options - more permissive for development
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'http://localhost:3000', 
        'http://127.0.0.1:3000'
      ]
    : '*', // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Authorization']
};

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(cors(corsOptions));

// Stripe webhook needs raw body
app.use('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Estate Sale Marketplace API' });
});

// Run auction end