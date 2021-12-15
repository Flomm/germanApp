import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../models/models/Enums/UserRole.enum';
import { forbiddenError } from '../../services/errorCreatorService/errorCreator.service';
import { jwtService } from '../../services/jwtService/jwt.service';

export default function permitChecker(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token: string | null = jwtService.getTokenFromRequest(req);
    if (!token) {
      return next(forbiddenError('Nincs autorizálva.'));
    }

    if (allowedRoles.includes(UserRole.All)) {
      return next();
    }

    const userRole: UserRole = jwtService.getUserRoleFromToken(token);
    if (!allowedRoles.includes(userRole)) {
      return next(forbiddenError('Hozzáférés megtagadva.'));
    }

    next();
  };
}
