import { UserRole } from '../enums/UserRole.enum';

export interface ILoginResponse {
  name: string;
  roleId: UserRole;
  token: string;
}
