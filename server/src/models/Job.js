import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  company: { type: String, required: true, trim: true, maxlength: 100 },
  role: { type: String, required: true, trim: true, maxlength: 100 },
  status: { type: String, enum: ["Wishlist", "Applied", "Interview", "Offer", "Rejected"], default: "Wishlist" },
  location: { type: String, default: "Not specified", maxlength: 100 },
  link: { type: String, default: "", maxlength: 500 },
  appliedAt: { type: Date, default: Date.now },
  notes: { type: String, default: "", maxlength: 1000 }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
