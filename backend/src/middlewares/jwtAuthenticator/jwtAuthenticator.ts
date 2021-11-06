import { Request, Response, NextFunction } from 'express';
import {
  forbiddenError,
  unauthorizedError,
} from '../../services/errorCreatorService/errorCreator.service';
import { jwtService } from '../../services/jwtService/jwt.service';

export default function tokenAuthentication() {
  return (req: Request, res: Response, next: NextFunction) => {
    const token: string | null = jwtService.getTokenFromRequest(req);
    if (!token) {
      return next(unauthorizedError('No valid token found'));
    } else {
      if (jwtService.verifyToken(token)) {
        return next();
      }
      return next(forbiddenError('No access'));
    }
  };
}
