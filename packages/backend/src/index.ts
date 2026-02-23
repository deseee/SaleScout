import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth';
import saleRoutes from './routes/sales';
import itemRoutes from './routes/items';

// Initialize dotenv
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // if you are using cookies or authorization headers
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/items', itemRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Estate Sale Marketplace API' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
