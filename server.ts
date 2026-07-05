import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { studentRouter } from "./backend/studentRouter";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health status
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Main high-completeness API endpoint routing mounts
  app.use("/api/student", studentRouter);

  // Vite development integration or production bundle serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[École 221 Backend] Server running on http://localhost:${PORT}`);
  });
}

startServer();
