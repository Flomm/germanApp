import IGetUserData from '../models/viewModels/IGetUserData.viewModel';

export default interface IGetUserResponse {
  userList: IGetUserData[];
  message?: string;
  isError?: boolean;
}
