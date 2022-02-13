import app from '../../app';
import request from 'supertest';
import IUserLoginRequest from '../../models/requests/IUserLoginRequest';
import { userService } from '../../services/userService/userService';
import { jwtService } from '../../services/jwtService/jwtService';
import { UserRole } from '../../models/models/Enums/UserRole.enum';
import IGetUserDataModel from '../../models/models/dataModels/IGetUserDataModel';
import { serverError } from '../../services/errorCreatorService/errorCreator.service';
import IPasswordRecoveryRequest from '../../models/requests/IPasswordRecoveryRequest';
import IUserDomainModel from '../../models/models/domainModels/IUserDomainModel';
import INewPasswordAddingRequest from '../../models/requests/INewPasswordAddingRequest';
import { userController } from './userController';
import IGetMyUserDataModel from '../../models/models/dataModels/IGetMyUserDataModel';
import IChangeUserNameDataModel from '../../models/models/dataModels/IChangeUserNameDataModel';

const user: IUserDomainModel = {
  id: 1,
  name: 'test',
  email: 'test@test.hu',
  isVerified: 1,
  verificationCode: 123456,
  password: 'test',
  roleId: UserRole.Consumer,
  passwordRecoveryCode: 123456,
};

const mockUsers: IGetUserDataModel[] = [
  {
    name: 'test',
    email: 'test@test.hu',
    isVerified: 1,
    roleId: UserRole.Consumer,
  },
];

const token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjI1ODU2Mzc5LCJleHAiOjE2MjU4NTk5Nzl9.q1O5nZgju0sO-ORTxiO745KkofE7nnFr0YsMML6Uuas';

describe('POST /login', () => {
  test('successful login', async () => {
    //Arrange
    const loginRequest: IUserLoginRequest = {
      email: 'test@test.hu',
      password: 'loginTest',
    };
    userService.loginUser = jest.fn().mockResolvedValue(user);
    jwtService.generateAccessToken = jest.fn().mockReturnValue('token');

    //Act
    const response = await request(app)
      .post('/api/user/login')
      .send(loginRequest);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ name: 'test', roleId: 2, token: 'token' });
    expect(userService.loginUser).toHaveBeenCalledWith({
      email: loginRequest.email,
      password: loginRequest.password,
    });
    expect(jwtService.generateAccessToken).toHaveBeenCalledWith(
      user.id,
      user.email,
      user.roleId,
    );
  });

  test('not provided password', async () => {
    //Arrange
    const loginRequest = {
      email: 'test@test.hu',
    };
    userService.loginUser = jest.fn().mockResolvedValue(user);
    jwtService.generateAccessToken = jest.fn().mockReturnValue('token');
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/user/login')
      .send(loginRequest);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Password mező megadása kötelező.',
    });
    expect(userService.loginUser).not.toHaveBeenCalled();
    expect(jwtService.generateAccessToken).not.toHaveBeenCalled();
  });

  test('not provided email', async () => {
    //Arrange
    const loginRequest = {
      password: 'test@test.hu',
    };
    userService.loginUser = jest.fn().mockResolvedValue(user);
    jwtService.generateAccessToken = jest.fn().mockReturnValue('token');
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/user/login')
      .send(loginRequest);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({ message: 'Email mező megadása kötelező.' });
    expect(userService.loginUser).not.toHaveBeenCalled();
    expect(jwtService.generateAccessToken).not.toHaveBeenCalled();
  });

  test('not provided email and password', async () => {
    //Arrange
    const loginRequest = {};
    userService.loginUser = jest.fn().mockResolvedValue(user);
    jwtService.generateAccessToken = jest.fn().mockReturnValue('token');
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/user/login')
      .send(loginRequest);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Email mező megadása kötelező. Password mező megadása kötelező.',
    });
    expect(userService.loginUser).not.toHaveBeenCalled();
    expect(jwtService.generateAccessToken).not.toHaveBeenCalled();
  });
});

describe('GET /', () => {
  test('succesfully retrieved users', async () => {
    //Arrange
    userService.getAllUsers = jest.fn().mockResolvedValue(mockUsers);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .get('/api/user')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ userList: mockUsers });
    expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
  });

  test('error in the service', async () => {
    //Arrange
    userService.getAllUsers = jest.fn().mockRejectedValue(serverError('test'));

    //Act
    const response = await request(app)
      .get('/api/user')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
  });
});

describe('PUT /password-recovery', () => {
  test('successful password recovery e-mail sent out', async () => {
    //Arrange
    const passwordRecoveryRequest: IPasswordRecoveryRequest = {
      email: 'test@test.hu',
    };
    userService.recoverUserPasswordByEmail = jest
      .fn()
      .mockResolvedValue(Promise.resolve);

    //Act
    const response = await request(app)
      .put('/api/user/password-recovery')
      .send(passwordRecoveryRequest);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'A jelszó visszaállító kód sikeresen elküldve.',
    });
    expect(userService.recoverUserPasswordByEmail).toHaveBeenCalledWith(
      passwordRecoveryRequest.email,
    );
  });

  test('not provided e-mail', async () => {
    //Arrange
    const passwordRecoveryRequest: IPasswordRecoveryRequest = {
      email: '',
    };
    userService.recoverUserPasswordByEmail = jest
      .fn()
      .mockResolvedValue(Promise.resolve);
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .put('/api/user/password-recovery')
      .send(passwordRecoveryRequest);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({ message: 'Email mező megadása kötelező.' });
    expect(userService.recoverUserPasswordByEmail).not.toHaveBeenCalled();
  });
});

describe('PUT /new-password', () => {
  test('successful password change', async () => {
    //Arrange
    const newPasswordAddingRequest: INewPasswordAddingRequest = {
      email: 'test@test.hu',
      passwordRecoveryCode: 123456,
      password: 'abc123!',
    };
    userService.updatePassword = jest.fn().mockResolvedValue(Promise.resolve);
    userController.checkPassword = jest.fn().mockReturnValue(true);

    //Act
    const response = await request(app)
      .put('/api/user/new-password')
      .send(newPasswordAddingRequest);

    //Assert
    expect(userController.checkPassword).toHaveBeenCalledWith(
      newPasswordAddingRequest.password,
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'Új jelszó hozzáadva.',
    });
    expect(userService.updatePassword).toHaveBeenCalledWith(
      newPasswordAddingRequest.email,
      newPasswordAddingRequest.passwordRecoveryCode,
      newPasswordAddingRequest.password,
    );
  });

  test('not provided password', async () => {
    //Arrange
    const newPasswordAddingRequest: INewPasswordAddingRequest = {
      email: 'test@test.hu',
      passwordRecoveryCode: 123456,
      password: '',
    };
    userService.updatePassword = jest.fn().mockResolvedValue(Promise.resolve);
    userController.checkPassword = jest.fn().mockReturnValue(undefined);
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .put('/api/user/new-password')
      .send(newPasswordAddingRequest);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(userController.checkPassword).not.toHaveBeenCalledWith(
      newPasswordAddingRequest.password,
    );
    expect(response.body).toEqual({
      message: 'Password mező megadása kötelező.',
    });
    expect(userService.updatePassword).not.toHaveBeenCalled();
  });

  test('password does not match', async () => {
    //Arrange
    const newPasswordAddingRequest: INewPasswordAddingRequest = {
      email: 'test@test.hu',
      passwordRecoveryCode: 123456,
      password: 'abc12',
    };
    userService.updatePassword = jest.fn().mockResolvedValue(Promise.resolve);
    userController.checkPassword = jest.fn().mockReturnValue(false);
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .put('/api/user/new-password')
      .send(newPasswordAddingRequest);

    //Assert
    expect(response.statusCode).toEqual(406);
    expect(userController.checkPassword).toHaveBeenCalledWith(
      newPasswordAddingRequest.password,
    );
    expect(userService.updatePassword).not.toHaveBeenCalled();
  });
});

describe('GET /my-data', () => {
  const mockUserMyData: IGetMyUserDataModel = {
    name: 'test',
    email: 'test@test.com',
  };
  const mockUserId: string = '1';

  test('succesfully retrieved user data', async () => {
    //Arrange
    userService.getMyData = jest.fn().mockResolvedValue(mockUserMyData);

    //Act
    const response = await request(app)
      .get('/api/user/my-data')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ userData: mockUserMyData });
    expect(userService.getMyData).toHaveBeenCalledWith(mockUserId);
  });

  test('error in the service', async () => {
    //Arrange
    userService.getMyData = jest.fn().mockRejectedValue(serverError('test'));

    //Act
    const response = await request(app)
      .get('/api/user/my-data')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(userService.getMyData).toHaveBeenCalledWith(mockUserId);
  });
});

describe('PUT /change-name', () => {
  const mockUserNameChangeData: IChangeUserNameDataModel = {
    name: 'test',
    id: '19',
  };

  const token: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE5LCJlbWFpbCI6ImZtaXJrYS5mbUBnbWFpbC5jb20iLCJyb2xlSWQiOjIsImlhdCI6MTYyOTcwNDQ2NSwiZXhwIjoxNjI5NzA4MDY1fQ.Wguv0VPU4fLNvYajkE1Wa5IzopLLM8Ssoy-NyGSa4r0';

  test('succesfully changed username', async () => {
    //Arrange
    userService.changeUserName = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    const response = await request(app)
      .put('/api/user/change-name')
      .set({ authorization: `Bearer ${token}` })
      .send(mockUserNameChangeData);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'A felhasználónév sikeresen megváltoztatva.',
    });
    expect(userService.changeUserName).toHaveBeenCalledWith(
      mockUserNameChangeData,
    );
  });

  test('username is not provided', async () => {
    //Arrange
    const mockUserNameChangeData: IChangeUserNameDataModel = {
      name: '',
      id: '19',
    };
    userService.changeUserName = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    const response = await request(app)
      .put('/api/user/change-name')
      .set({ authorization: `Bearer ${token}` })
      .send(mockUserNameChangeData);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Name mező megadása kötelező.',
    });
    expect(userService.changeUserName).not.toHaveBeenCalledWith(
      mockUserNameChangeData,
    );
  });

  test('error in the service', async () => {
    //Arrange
    userService.changeUserName = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    const response = await request(app)
      .put('/api/user/change-name')
      .set({ authorization: `Bearer ${token}` })
      .send(mockUserNameChangeData);

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(userService.changeUserName).toHaveBeenCalledWith(
      mockUserNameChangeData,
    );
  });
});
