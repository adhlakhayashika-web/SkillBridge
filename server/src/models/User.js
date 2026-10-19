import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  targetRole: { type: String, default: "Frontend Developer" },
  roadmapCompleted: { type: [String], default: [] },
  assessment: {
    interests: { type: [String], default: [] },
    experience: { type: String, default: "Beginner" },
    goal: { type: String, default: "Get job-ready" }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
