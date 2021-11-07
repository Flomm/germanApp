export default interface INewPasswordRequest {
  passwordRecoveryCode: number;
  email: string;
  password: string;
}
