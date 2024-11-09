import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils";
import { ErrorMessages } from "../constants";

export const ErrorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;

  if (error instanceof AppError) {
    return res.status(statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(statusCode).json({ errors: error.flatten().fieldErrors });
  }

  return res
    .status(statusCode)
    .json({ message: ErrorMessages.INTERNAL_SERVER_ERROR });
};
