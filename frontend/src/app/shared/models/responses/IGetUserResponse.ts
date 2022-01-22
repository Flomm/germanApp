import IGetUserData from '../viewModels/IGetUserData.viewModel';

export default interface IGetUserResponse {
  userList: IGetUserData[];
  message?: string;
  isError?: boolean;
}
