import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const ErrorHandler: ErrorRequestHandler = (
  error: any, // I Used here any as the default definition of ErrorRequestHandler
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(500).send(error);
};
