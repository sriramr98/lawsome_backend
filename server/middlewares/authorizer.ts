import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

async function extractUserFromToken(token: string) {
  try {
    const user = await admin.auth().verifyIdToken(token, true);
    console.log(JSON.stringify(user))
    return user;
  } catch (e: any) {
    return null;
  }
}

async function authorize(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json("Invalid Auth Token");
  }

  const user = await extractUserFromToken(token);
  if (!user) {
    return res.status(400).json("Invalid Auth Token");
  }

  res.locals.user = user;
  next();
}

export default {
  authorize,
  extractUserFromToken,
};
