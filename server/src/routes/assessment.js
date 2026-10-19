import { Router } from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();
const roleMap = {
  "Frontend Development": "Frontend Developer",
  "Backend Development": "Backend Developer",
  "Data Analytics": "Data Analyst",
  "AI / Machine Learning": "AI / ML Engineer",
  "UI/UX Design": "Product Designer"
};
router.post("/", auth, async (req, res) => {
  const { interests = [], experience = "Beginner", goal = "Get job-ready" } = req.body;
  if (!Array.isArray(interests) || interests.length === 0) return res.status(400).json({ message: "Choose at least one interest." });
  const targetRole = roleMap[interests[0]] || "Software Developer";
  const user = await User.findByIdAndUpdate(req.userId, {
    targetRole, assessment: { interests, experience, goal }
  }, { new: true }).select("targetRole assessment");
  res.json({ targetRole: user.targetRole, assessment: user.assessment, message: "Your career profile has been saved." });
});
export default router;
