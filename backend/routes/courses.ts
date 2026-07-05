import { Router } from "express";
import { readDb, writeDb } from "../db";

export const coursesRouter = Router();

coursesRouter.get("/courses", (req, res) => {
  res.json(readDb().courses || []);
});

coursesRouter.post("/courses/:id/progress", (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;
  const db = readDb();
  if (!db.courses) {
    db.courses = [];
  }
  const idx = db.courses.findIndex((c) => c.id === id);
  if (idx !== -1) {
    db.courses[idx].progress = progress;
    writeDb(db);
    res.json({ success: true, course: db.courses[idx] });
  } else {
    res.status(404).json({ error: "Course not found" });
  }
});
