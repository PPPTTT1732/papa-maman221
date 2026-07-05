import { Router } from "express";
import { profileRouter } from "./routes/profile";
import { attendanceRouter } from "./routes/attendance";
import { homeworkRouter } from "./routes/homework";
import { liveRouter } from "./routes/live";
import { coursesRouter } from "./routes/courses";
import { tutorRouter } from "./routes/tutor";

export const studentRouter = Router();

// Hook up all student feature-specific endpoint sub-routers
studentRouter.use(profileRouter);
studentRouter.use(attendanceRouter);
studentRouter.use(homeworkRouter);
studentRouter.use(liveRouter);
studentRouter.use(coursesRouter);
studentRouter.use(tutorRouter);
