import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not defined");
    return secret;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, getJwtSecret()) as { id: string };
        (req as any).userId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
