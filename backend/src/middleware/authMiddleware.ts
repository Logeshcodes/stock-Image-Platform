import { Request, Response, NextFunction } from "express";
  import jwt from "jsonwebtoken";

export const authMiddleware = (req: any, res: any, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    req.userId = (decoded as any)._id;
    
    next(); 
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
