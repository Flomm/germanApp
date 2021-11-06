export default interface IUserDomainModel {
  id: number;
  name: string;
  email: string;
  password: string;
  verificationCode: number;
  isVerified: number;
  roleId: number;
  passwordRecoveryCode: number;
}
