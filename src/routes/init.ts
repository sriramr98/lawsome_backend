import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get("/health", (req: Request, res: Response, next: NextFunction) => {
  return res.json({ status: "OK" });
});

export default router;
