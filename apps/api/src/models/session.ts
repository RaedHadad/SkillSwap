// models/Session.ts
import { Schema, model, Types } from 'mongoose';
const SessionSchema = new Schema({
  learner: { type: Types.ObjectId, ref:'User', required:true },
  teacher: { type: Types.ObjectId, ref:'User', required:true },
  skill: String,
  startsAt: Date,
  endsAt: Date,
  status: { type:String, enum:['proposed','confirmed','completed','canceled'], default:'proposed' }
}, { timestamps:true });
export default model('Session', SessionSchema);
