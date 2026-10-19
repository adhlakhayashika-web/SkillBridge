import { Router } from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import roadmap from "../data/roadmap.js";

const router = Router();
router.get("/", auth, async (req, res) => {
  const [user, jobs] = await Promise.all([
    User.findById(req.userId).select("name targetRole roadmapCompleted assessment"),
    Job.find({ user: req.userId }).select("status company role updatedAt").sort({ updatedAt: -1 }).limit(5)
  ]);
  const totalTasks = roadmap.reduce((sum, item) => sum + item.tasks.length, 0);
  const completed = user?.roadmapCompleted?.length || 0;
  const counts = { Wishlist: 0, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  const allJobs = await Job.find({ user: req.userId }).select("status");
  allJobs.forEach((job) => { counts[job.status] = (counts[job.status] || 0) + 1; });
  res.json({
    user: { name: user?.name, targetRole: user?.targetRole, assessment: user?.assessment },
    stats: { roadmapProgress: totalTasks ? Math.round(completed / totalTasks * 100) : 0, completedTasks: completed, totalTasks, applications: allJobs.length, interviews: counts.Interview, offers: counts.Offer },
    recentJobs: jobs
  });
});
export default router;
