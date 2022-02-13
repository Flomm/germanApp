import { Request, Response, NextFunction } from 'express';
import { unauthorizedError } from '../../services/errorCreatorService/errorCreator.service';
import { jwtService } from '../../services/jwtService/jwtService';

export default function tokenAuthentication() {
  return (req: Request, res: Response, next: NextFunction) => {
    const token: string | null = jwtService.getTokenFromRequest(req);
    if (!token) {
      return next(unauthorizedError('Nincs érvényes token.'));
    } else {
      if (jwtService.verifyToken(token)) {
        return next();
      }
      return next(unauthorizedError('Nincs érvényes token.'));
    }
  };
}
