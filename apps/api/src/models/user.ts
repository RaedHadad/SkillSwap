import { Schema, model } from 'mongoose';
const Availability = new Schema({ day: String, start: String, end: String }, { _id:false });
const Prefs = new Schema({ comms: String, languages: [String] }, { _id:false });

const UserSchema = new Schema({
  name: String,
  email: { type:String, unique:true, index:true },
  passHash: String,
  skillsTeach: { type:[String], index:true },
  skillsLearn: { type:[String], index:true },
  availability: { type:[Availability], index:true },
  prefs: Prefs,
  ratingAvg: { type:Number, default:0 },
  points: { type:Number, default:0 }
}, { timestamps:true });

export default model('User', UserSchema);
