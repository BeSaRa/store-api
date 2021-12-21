import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ").pop();
    console.log(token);
    const { SECRET_TOKEN_KEY } = process.env;
    jwt.verify(token!, SECRET_TOKEN_KEY!);
    next();
  } catch (e) {
    res.status(401).send("Access denied, invalid token");
  }
}
