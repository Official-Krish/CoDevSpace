import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | jwt.JwtPayload; 
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not found" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as jwt.JwtPayload;

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
}
