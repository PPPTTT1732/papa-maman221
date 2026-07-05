import { Router } from "express";
import { readDb, writeDb } from "../db";

export const attendanceRouter = Router();

attendanceRouter.get("/attendances", (req, res) => {
  res.json(readDb().attendances || []);
});

attendanceRouter.post("/attendances", (req, res) => {
  const { type, method, location, salle } = req.body;
  const db = readDb();
  if (!db.attendances) {
    db.attendances = [];
  }
  const newLog = {
    id: "att-" + Date.now(),
    timestamp: new Date().toISOString(),
    type: type || "arrivée",
    method: method || "QR Code",
    status: "Validé d'office",
    salle: salle || "Amphi A",
    location: location || "Dakar Campus - Coordonnées GPS: 14.6937, -17.4441"
  };
  db.attendances.unshift(newLog);
  writeDb(db);
  res.json({ success: true, item: newLog });
});
