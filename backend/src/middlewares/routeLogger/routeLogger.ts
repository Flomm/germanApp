import { NextFunction, Request, Response } from 'express';

export default function routeLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const currentTime = new Date();
  const formattedDate = `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()} ${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
  console.log(
    `[${formattedDate}] ${req.originalUrl} - ${req.method} - ${req.ip}`,
  );
  next();
}
