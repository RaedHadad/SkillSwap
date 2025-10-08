// apps/api/src/routes/match.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/user.js';

const r = Router();

r.post('/search', requireAuth, async (req, res) => {
  const meId = (req as any).userId;
  const { skill, prefs, window } = req.body as {
    skill: string; prefs?: { comms?: string }; window?: { day: string };
  };

  const candidates = await User.find({ _id: { $ne: meId }, skillsTeach: skill });
  const ranked = candidates.map(c => {
    let score = 0;
    if (c.skillsTeach?.includes(skill)) score += 50;
    if (window && c.availability?.some(a => a.day === window.day)) score += 20;
    if (prefs?.comms && c.prefs?.comms === prefs.comms) score += 15;
    if ((c.ratingAvg ?? 0) >= 4.5) score += 10;
    return { id: c.id, name: c.name, ratingAvg: c.ratingAvg, score };
  }).sort((a,b)=>b.score-a.score).slice(0,10);

  res.json(ranked);
});

export default r; // ← make sure this line exists
