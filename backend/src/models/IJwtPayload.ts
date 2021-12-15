import { UserRole } from './models/Enums/UserRole.enum';

export default interface IJwtPayload {
  userId: number;
  email: string;
  roleId: UserRole;
  iat: number;
  exp: number;
}
