import { transports, format, createLogger } from "winston";
import { type RequestHandler } from "express";
import { HttpStatusCode } from "../constants";

export class AppError extends Error {
  statusCode: HttpStatusCode;
  constructor(message: string, statusCode: HttpStatusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const AsyncHandler =
  (fn: Function): RequestHandler =>
  async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

const logFormat = format.combine(
  format.timestamp(),
  format.colorize(),
  format.align(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

export const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [new transports.Console()],
});
