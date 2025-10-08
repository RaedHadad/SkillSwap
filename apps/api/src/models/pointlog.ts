// models/PointLog.ts
import { Schema, model, Types } from 'mongoose';
const PointLog = new Schema({
  user: { type: Types.ObjectId, ref:'User', required:true },
  delta: Number,
  reason: { type:String, enum:['teach','learn','streak','late_cancel','bonus'] },
  sessionId: { type: Types.ObjectId, ref:'Session' }
}, { timestamps:true });
export default model('PointLog', PointLog);
