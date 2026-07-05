import { Router } from "express";
import { readDb, writeDb } from "../db";

export const profileRouter = Router();

profileRouter.get("/profile", (req, res) => {
  res.json(readDb().studentProfile || {});
});

profileRouter.post("/mood", (req, res) => {
  const { mood } = req.body;
  const db = readDb();
  if (!db.studentProfile) {
    db.studentProfile = {};
  }
  db.studentProfile.mood = mood;
  writeDb(db);
  res.json({ success: true, profile: db.studentProfile });
});
