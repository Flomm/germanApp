import { Request, Response, NextFunction } from 'express';
import IApiError from '../../models/IApiError';

export default function errorHandler(
  err: IApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(
    `${'status' in err ? err.status : 500} - ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`,
  );
  if (err instanceof Error) {
    res.status(500).json({
      message:
        req.app.get('env') === 'development'
          ? err.message
          : 'Unknown error happened',
    });
  } else {
    res.status(err.status).json({ message: err.message });
  }
}
