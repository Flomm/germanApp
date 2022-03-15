/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
import IApiError from '../../models/IApiError';

export default function errorHandler(
  err: IApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const currentTime = new Date();
  const formattedDate = `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()} ${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
  console.error(
    `[${formattedDate}] - ${chalk.red('status' in err ? err.status : 500)} - ${
      err.message
    } - ${req.originalUrl} - ${req.method} - ${req.ip}`,
  );
  if (err instanceof Error) {
    res.status(500).json({
      message:
        req.app.get('env') === 'development'
          ? err.message
          : 'Ismeretlen hiba történt.',
    });
  } else {
    res.status(err.status).json({ message: err.message });
  }
}
