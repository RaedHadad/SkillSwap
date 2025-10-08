import { Router } from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const r = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

r.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing_fields' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'email_in_use' });
  const passHash = await bcrypt.hash(password, 10);
  const u = await User.create({ name, email, passHash });
  res.status(201).json({ id: u.id });
});

r.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u || !(await bcrypt.compare(password, u.passHash))) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }
  const token = jwt.sign({ sub: u.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

export default r;
