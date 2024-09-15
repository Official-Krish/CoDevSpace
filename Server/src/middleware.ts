import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as jwt.JwtPayload;

        if (!payload.email) {
            return res.status(401).json({ error: "Invalid token" });
        }
        // @ts-ignore
        req.user = { email: payload.email };
        next();
    } catch (e) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
