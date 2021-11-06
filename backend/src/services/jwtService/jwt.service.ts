import { Request } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import IJwtPayload from '../../models/IJwtPayload';

export const jwtService = {
  generateAccessToken(userId: number, email: string, roleId: number): string {
    return jwt.sign({ userId, email, roleId }, config.jwt.secretKey!, {
      expiresIn: '1h',
    });
  },

  getUserIdFromToken(token: string): number {
    const payload = jwt.decode(token) as IJwtPayload;
    return payload.userId;
  },

  getUserRoleFromToken(token: string): number {
    const payload = jwt.decode(token) as IJwtPayload;
    return payload.roleId;
  },

  verifyToken(token: string): boolean {
    try {
      jwt.verify(token, config.jwt.secretKey!);
      return true;
    } catch (err) {
      return false;
    }
  },

  getTokenFromRequest(req: Request): string | null {
    if (!req.headers.authorization) {
      return null;
    } else {
      return req.headers.authorization.split(' ')[1];
    }
  },
};
