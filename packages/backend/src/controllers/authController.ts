import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const SALT_ROUNDS = 10;

interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
}

interface LoginRequestBody {
  email: string;
  password: string;
}

class AuthController {
  // Register a new user
  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body as RegisterRequestBody;

      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          role,
          password: hashedPassword, // Note: You'll need to add password field to Prisma schema
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return user data without password
      const { password: _, ...userData } = user;

      res.status(201).json({
        message: 'User registered successfully',
        user: userData,
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error during registration' });
    }
  }

  // Login user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as LoginRequestBody;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return user data without password
      const { password: _, ...userData } = user;

      res.json({
        message: 'Login successful',
        user: userData,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  }
}

export default new AuthController();
