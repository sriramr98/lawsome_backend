import express, { NextFunction, Request, Response } from "express";
import chatRouter from "./chat";

const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

router.get("/health", (req: Request, res: Response, next: NextFunction) => {
  return res.json({ status: "OK" });
});

router.use("/chat", chatRouter);

export default router;
