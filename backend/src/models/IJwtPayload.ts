import { UserRole } from './models/enums/UserRole.enum';

export default interface IJwtPayload {
  userId: number;
  email: string;
  roleId: UserRole;
  iat: number;
  exp: number;
}
