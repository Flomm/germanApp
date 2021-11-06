export default interface IRegisterUserDataModel {
    name: string;
    email: string;
    password: string;
    verificationCode?: number;
    roleId: number;
  }