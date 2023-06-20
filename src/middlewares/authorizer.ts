import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.json("Invalid Auth Token");
  }
  try {
    const user = await admin.auth().verifyIdToken(token, true);
    console.log({ user });
    if (user) {
      res.locals.user = user;
      next();
    } else {
      return res.json("Cannot find User");
    }
  } catch (e: any) {
    return res.json(e.message);
  }
}
