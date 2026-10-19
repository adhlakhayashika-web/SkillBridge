import { Router } from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import roadmap from "../data/roadmap.js";

const router = Router();
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("roadmapCompleted targetRole");
  res.json({ roadmap, completed: user?.roadmapCompleted || [], targetRole: user?.targetRole || "Frontend Developer" });
});
router.patch("/progress", auth, async (req, res) => {
  const { taskId, completed } = req.body;
  const allTaskIds = roadmap.flatMap((item) => item.tasks.map((_, i) => `${item.id}-${i}`));
  if (!allTaskIds.includes(taskId)) return res.status(400).json({ message: "Unknown roadmap task." });
  const update = completed ? { $addToSet: { roadmapCompleted: taskId } } : { $pull: { roadmapCompleted: taskId } };
  const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select("roadmapCompleted");
  res.json({ completed: user.roadmapCompleted });
});
export default router;
