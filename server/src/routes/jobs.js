import { Router } from "express";
import auth from "../middleware/auth.js";
import Job from "../models/Job.js";

const router = Router();
router.get("/", auth, async (req, res) => {
  const jobs = await Job.find({ user: req.userId }).sort({ updatedAt: -1 });
  res.json({ jobs });
});
router.post("/", auth, async (req, res) => {
  const { company, role, status, location, link, notes } = req.body;
  if (!company?.trim() || !role?.trim()) return res.status(400).json({ message: "Company and role are required." });
  const job = await Job.create({ user: req.userId, company, role, status, location, link, notes });
  res.status(201).json({ job });
});
router.patch("/:id", auth, async (req, res) => {
  const allowed = ["company", "role", "status", "location", "link", "notes"];
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const job = await Job.findOneAndUpdate({ _id: req.params.id, user: req.userId }, update, { new: true, runValidators: true });
  if (!job) return res.status(404).json({ message: "Job application not found." });
  res.json({ job });
});
router.delete("/:id", auth, async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!job) return res.status(404).json({ message: "Job application not found." });
  res.json({ message: "Application deleted." });
});
export default router;
