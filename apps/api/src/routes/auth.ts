import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config.js';
import { User } from '../models/User.js';
import type { AuthenticatedUser } from '../middleware/auth.js';

const authRouter = Router();

function toProfile(user: { id?: string; _id?: unknown; name: string; email: string }): AuthenticatedUser {
  const id = typeof user.id === 'string' ? user.id : String(user._id);
  return { id, name: user.name, email: user.email };
}

function createToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const normalizedEmail = String(email).toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, password: hashedPassword });
    const profile = toProfile(user);
    const token = createToken(profile.id);

    return res.status(201).json({ token, user: profile });
  } catch (error) {
    console.error('Failed to register user', error);
    return res.status(500).json({ message: 'Unable to register user' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = String(email).toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const profile = toProfile(user);
    const token = createToken(profile.id);

    return res.json({ token, user: profile });
  } catch (error) {
    console.error('Failed to login user', error);
    return res.status(500).json({ message: 'Unable to login user' });
  }
});

export default authRouter;
