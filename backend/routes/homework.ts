import { Router } from "express";
import { readDb, writeDb } from "../db";

export const homeworkRouter = Router();

homeworkRouter.get("/homeworks", (req, res) => {
  res.json(readDb().homeworks || []);
});

homeworkRouter.post("/homeworks/:id/submit", (req, res) => {
  const { id } = req.params;
  const { fileName, comments } = req.body;
  const db = readDb();
  if (!db.homeworks) {
    db.homeworks = [];
  }
  const idx = db.homeworks.findIndex((t) => t.id === id);
  if (idx !== -1) {
    db.homeworks[idx].statut = "soumis";
    if (!db.homeworks[idx].submittedFiles) {
      db.homeworks[idx].submittedFiles = [];
    }
    db.homeworks[idx].submittedFiles.push(fileName || "rendu_final_etudiant.zip");
    const dateStr = new Date().toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' });
    db.homeworks[idx].deadlineStr = `Fini le ${dateStr}`;
    db.homeworks[idx].comments = comments || "";
    writeDb(db);
    res.json({ success: true, task: db.homeworks[idx] });
  } else {
    res.status(404).json({ error: "Homework task not found" });
  }
});
