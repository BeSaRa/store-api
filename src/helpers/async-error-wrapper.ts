import { NextFunction, Request, RequestHandler, Response } from "express";

export class AsyncErrorWrapper {
  static catch(callback: RequestHandler): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await callback(req, res, next);
      } catch (e: any) {
        next({ message: "something went wrong: " + e.message });
      }
    };
  }
}
