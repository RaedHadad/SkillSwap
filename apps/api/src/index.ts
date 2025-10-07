import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import { authenticate, type AuthRequest } from './middleware/auth.js';

const app = express();
app.use(cors({ origin: (process.env.CLIENT_ORIGINS || '').split(',').filter(Boolean) }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.get('/me', authenticate, (req, res) => {
  const { user } = req as AuthRequest;
  res.json({ user });
});

const port = Number(process.env.PORT || 4000);
const mongo = process.env.MONGO_URL || 'mongodb://localhost:27017/skillswap';

async function main() {
  await mongoose.connect(mongo);
  app.listen(port, () => console.log(`API on :${port}`));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
