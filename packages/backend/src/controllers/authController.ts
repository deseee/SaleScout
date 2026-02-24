import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { handleReferralBadge, handlePointsBadge } from './userController';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, referralCode } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate unique referral code
    const userReferralCode = uuidv4().substring(0, 8).toUpperCase();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        password: hashedPassword,
        referralCode: userReferralCode,
        points: 0
      }
    });

    // Handle referral if provided
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode }
      });

      if (referrer) {
        // Create referral record
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredUserId: user.id
          }
        });

        // Award points to referrer (e.g., 50 points)
        const pointsToAdd = 50;
        await prisma.user.update({
          where: { id: referrer.id },
          data: {
            points: {
              increment: pointsToAdd
            }
          }
        });

        // Check for referral badge
        await handleReferralBadge(referrer.id);

        // Check for points badge
        const updatedReferrer = await prisma.user.findUnique({
          where: { id: referrer.id }
        });
        
        if (updatedReferrer) {
          await handlePointsBadge(referrer.id, updatedReferrer.points);
        }
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials - User not found' });
    }

    // Check if user has a password (some OAuth users might not)
    if (!user.password) {
      return res.status(400).json({ message: 'Account not set up for password login. Please contact support.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials - Incorrect password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
