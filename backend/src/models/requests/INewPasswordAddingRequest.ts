export default interface INewPasswordAddingRequest {
  email: string;
  passwordRecoveryCode: number;
  password: string;
}
