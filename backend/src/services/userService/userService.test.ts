import IGetUserDataModel from '../../models/models/dataModels/IGetUserDataModel';
import config from '../../config';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import ILoginUserDataModel from '../../models/models/dataModels/ILoginUserDataModel';
import IUpdatePasswordDataModel from '../../models/models/dataModels/IUpdatePasswordDataModel';
import IUserDomainModel from '../../models/models/domainModels/IUserDomainModel';
import { UserRole } from '../../models/models/Enums/UserRole.enum';
import INewPasswordAddingRequest from '../../models/requests/INewPasswordAddingRequest';
import IPasswordRecoveryRequest from '../../models/requests/IPasswordRecoveryRequest';
import { userRepository } from '../../repository/userRepository/userRepository';
import { codeGeneratorService } from '../codeGeneratorService/codeGeneratorService';
import { emailService } from '../emailService/emailService';
import {
  forbiddenError,
  notFoundError,
  serverError,
  unauthorizedError,
} from '../errorCreatorService/errorCreatorService';
import { hashPasswordService } from '../hashPasswordService/hashPasswordService';
import { userService } from './userService';
import IEmailReplacements from '../../models/IEmailReplacements';
import IGetMyUserDataModel from '../../models/models/dataModels/IGetMyUserDataModel';
import IChangeUserNameDataModel from '../../models/models/dataModels/IChangeUserNameDataModel';
import IMailjetMail from '../../models/IMailjetMail';
import IChangePasswordRequest from '../../models/requests/IChangePasswordRequest';

const userDb: IUserDomainModel[] = [
  {
    id: 1,
    name: 'test',
    email: 'test@test.hu',
    isVerified: 1,
    verificationCode: 123456,
    password: 'test',
    roleId: UserRole.Consumer,
    passwordRecoveryCode: 123456,
  },
  {
    id: 2,
    name: 'test2',
    email: 'test2@test.hu',
    isVerified: 0,
    verificationCode: 234567,
    password: 'test2',
    roleId: UserRole.Admin,
    passwordRecoveryCode: 654321,
  },
];

const mockUsers: IGetUserDataModel[] = [
  {
    name: 'test',
    email: 'test@test.hu',
    isVerified: 1,
    roleId: UserRole.Consumer,
  },
];

describe('loginUser', () => {
  const loginRequest: ILoginUserDataModel = {
    email: 'test@test.hu',
    password: 'loginTest',
  };
  test('sucsessful login', async () => {
    //Arrange
    userRepository.getUserByEmail = jest.fn().mockResolvedValue(userDb[0]);
    hashPasswordService.comparePasswords = jest.fn().mockReturnValue(true);

    //Act
    const user = await userService.loginUser(loginRequest);

    //Assert
    expect(user).toStrictEqual(userDb[0]);
    expect(userRepository.getUserByEmail).toHaveBeenCalledWith('test@test.hu');
    expect(hashPasswordService.comparePasswords).toHaveBeenCalledWith(
      'loginTest',
      userDb[0].password,
    );
  });

  test('not verified user should return forbiddenError', async () => {
    //Arrange
    userRepository.getUserByEmail = jest.fn().mockResolvedValue(userDb[1]);
    hashPasswordService.comparePasswords = jest.fn().mockReturnValue(true);

    //Act
    try {
      await userService.loginUser(loginRequest);
    } catch (err) {
      //Assert
      expect(err).toEqual(
        forbiddenError('Ez az e-mail cím még nincs megerősítve.'),
      );
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'test@test.hu',
      );
      expect(hashPasswordService.comparePasswords).toHaveBeenCalledWith(
        'loginTest',
        userDb[1].password,
      );
    }
  });

  test('not found user', async () => {
    //Arrange
    userRepository.getUserByEmail = jest.fn().mockResolvedValue(undefined);
    hashPasswordService.comparePasswords = jest.fn().mockReturnValue(true);

    //Act
    try {
      await userService.loginUser(loginRequest);
    } catch (err) {
      //Assert
      expect(err).toEqual(unauthorizedError('E-mail vagy jelszó helytelen.'));
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'test@test.hu',
      );
      expect(hashPasswordService.comparePasswords).not.toHaveBeenCalled();
    }
  });

  test('not matching password', async () => {
    //Arrange
    userRepository.getUserByEmail = jest.fn().mockResolvedValue(userDb[0]);
    hashPasswordService.comparePasswords = jest.fn().mockReturnValue(false);

    //Act
    try {
      await userService.loginUser(loginRequest);
    } catch (err) {
      //Assert
      expect(err).toEqual(unauthorizedError('E-mail vagy jelszó helytelen.'));
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'test@test.hu',
      );
      expect(hashPasswordService.comparePasswords).toHaveBeenCalledWith(
        'loginTest',
        userDb[0].password,
      );
    }
  });

  test('repository error', async () => {
    //Arrange
    userRepository.getUserByEmail = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    hashPasswordService.comparePasswords = jest.fn().mockReturnValue(false);

    //Act
    try {
      await userService.loginUser(loginRequest);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'test@test.hu',
      );
      expect(hashPasswordService.comparePasswords).not.toHaveBeenCalled();
    }
  });
});

describe('getAllUsers', () => {
  test('successfully retrieved users', async () => {
    //Arrange
    userRepository.getAllUsers = jest.fn().mockResolvedValue(mockUsers);

    //Act
    const users = await userService.getAllUsers();

    //Assert
    expect(users).toStrictEqual(mockUsers);
    expect(userRepository.getUserByEmail).toHaveBeenCalledTimes(1);
  });
  test('repository error', async () => {
    //Arrange
    userRepository.getAllUsers = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await userService.getAllUsers();
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(userRepository.getAllUsers).toHaveBeenCalledTimes(1);
    }
  });
});

describe('recoverPasswordByEmail', () => {
  const passwordRecoveryRequest: IPasswordRecoveryRequest = {
    email: 'test@test.hu',
  };

  test('successful password recovery request', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 1,
    };
    const mockSixDigitCode = 123456;

    userRepository.getUserByEmail = jest.fn().mockResolvedValue(userDb[0]);
    userRepository.recoverPassword = jest.fn().mockResolvedValue(mockDbResult);
    emailService.sendMailJetMail = jest.fn().mockResolvedValue(Promise.resolve);
    codeGeneratorService.generateSixDigitCode = jest
      .fn()
      .mockReturnValue(mockSixDigitCode);

    //Act
    await userService.recoverUserPasswordByEmail(passwordRecoveryRequest.email);

    //Assert
    expect(userRepository.getUserByEmail).toHaveBeenCalledWith('test@test.hu');
    expect(emailService.sendMailJetMail).toBeCalledTimes(1);
  });

  test('not found user', async () => {
    //Arrange
    userRepository.getUserByEmail = jest.fn().mockResolvedValue(undefined);
    emailService.sendMailJetMail = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    try {
      await userService.recoverUserPasswordByEmail(
        passwordRecoveryRequest.email,
      );
    } catch (err) {
      //Assert
      expect(err).toEqual(notFoundError('E-mail nem található.'));
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'test@test.hu',
      );
      expect(emailService.sendMailJetMail).not.toHaveBeenCalled();
    }
  });

  test('repository error', async () => {
    //Arrange
    userRepository.getUserByEmail = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    emailService.sendMailJetMail = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    try {
      await userService.recoverUserPasswordByEmail(
        passwordRecoveryRequest.email,
      );
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'test@test.hu',
      );
      expect(emailService.sendMailJetMail).not.toHaveBeenCalled();
    }
  });
});

describe('updatePassword', () => {
  const newPasswordAddingRequest: INewPasswordAddingRequest = {
    email: 'test@test.hu',
    passwordRecoveryCode: 123456,
    password: 'abc123!',
  };
  const mockDbResult: IDbResultDataModel = {
    affectedRows: 1,
  };
  const mockNewPasswordData: IUpdatePasswordDataModel = {
    id: userDb[0].id,
    password: 'testHash',
  };

  test('successful password change request', async () => {
    //Arrange
    userRepository.getUserByEmail = jest.fn().mockResolvedValue(userDb[0]);
    userRepository.updatePassword = jest.fn().mockResolvedValue(mockDbResult);
    hashPasswordService.generateHash = jest.fn().mockReturnValue('testHash');

    //Act
    await userService.updatePassword(
      newPasswordAddingRequest.email,
      newPasswordAddingRequest.passwordRecoveryCode,
      newPasswordAddingRequest.password,
    );

    //Assert
    expect(userRepository.getUserByEmail).toHaveBeenCalledWith('test@test.hu');
    expect(hashPasswordService.generateHash).toHaveBeenCalledWith(
      newPasswordAddingRequest.password,
    );
    expect(userRepository.updatePassword).toHaveBeenCalledWith(
      mockNewPasswordData,
    );
  });

  test('if no user exists', async () => {
    //Arrange
    userRepository.getUserByEmail = jest.fn().mockResolvedValue(undefined);
    hashPasswordService.generateHash = jest.fn().mockReturnValue('testHash');
    userRepository.updatePassword = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    try {
      await userService.updatePassword(
        newPasswordAddingRequest.email,
        newPasswordAddingRequest.passwordRecoveryCode,
        newPasswordAddingRequest.password,
      );
    } catch (err) {
      //Assert
      expect(err).toEqual(notFoundError('E-mail nem található.'));
      expect(hashPasswordService.generateHash).not.toHaveBeenCalled();
      expect(userRepository.updatePassword).not.toHaveBeenCalled();
    }
  });

  test('repository error', async () => {
    //Arrange
    userRepository.getUserByEmail = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    hashPasswordService.generateHash = jest.fn().mockReturnValue('testHash');
    userRepository.updatePassword = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    try {
      await userService.updatePassword(
        newPasswordAddingRequest.email,
        newPasswordAddingRequest.passwordRecoveryCode,
        newPasswordAddingRequest.password,
      );
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(hashPasswordService.generateHash).not.toHaveBeenCalled();
      expect(userRepository.updatePassword).not.toHaveBeenCalled();
    }
  });
});

describe('changePassword', () => {
  const passwordChangeRequest: IChangePasswordRequest = {
    newPassword: 'flomm123',
    oldPassword: 'abc123!',
  };
  const mockUserId = '1';
  const mockDbResult: IDbResultDataModel = {
    affectedRows: 1,
  };
  const mockNewPasswordData: IUpdatePasswordDataModel = {
    id: userDb[0].id,
    password: 'testHash',
  };

  test('successful password change request', async () => {
    //Arrange
    userRepository.getAllUserDataById = jest.fn().mockResolvedValue(userDb[0]);
    userRepository.updatePassword = jest.fn().mockResolvedValue(mockDbResult);
    hashPasswordService.generateHash = jest.fn().mockReturnValue('testHash');
    hashPasswordService.comparePasswords = jest.fn().mockReturnValue(true);

    //Act
    await userService.changePassword(mockUserId, passwordChangeRequest);

    //Assert
    expect(userRepository.getAllUserDataById).toHaveBeenCalledWith(mockUserId);
    expect(hashPasswordService.generateHash).toHaveBeenCalledWith(
      passwordChangeRequest.newPassword,
    );
    expect(userRepository.updatePassword).toHaveBeenCalledWith(
      mockNewPasswordData,
    );
  });

  test('previous password is not matching the one in the db', async () => {
    //Arrange
    userRepository.getAllUserDataById = jest.fn().mockResolvedValue(userDb[0]);
    userRepository.updatePassword = jest.fn().mockResolvedValue(mockDbResult);
    hashPasswordService.comparePasswords = jest.fn().mockReturnValue(false);

    //Act
    try {
      await userService.changePassword(mockUserId, passwordChangeRequest);
    } catch (err) {
      //Assert
      expect(err).toEqual(
        unauthorizedError('A megadott régi jelszó helytelen.'),
      );
      expect(userRepository.getAllUserDataById).toHaveBeenCalledWith(
        mockUserId,
      );
      expect(hashPasswordService.comparePasswords).toHaveBeenCalledWith(
        'abc123!',
        'test',
      );
      expect(userRepository.updatePassword).not.toHaveBeenCalled();
    }
  });

  test('repository error', async () => {
    //Arrange
    userRepository.getAllUserDataById = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    userRepository.updatePassword = jest.fn().mockResolvedValue(mockDbResult);
    hashPasswordService.generateHash = jest.fn().mockReturnValue('testHash');

    //Act
    try {
      await userService.changePassword(mockUserId, passwordChangeRequest);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(hashPasswordService.generateHash).not.toHaveBeenCalled();
      expect(userRepository.updatePassword).not.toHaveBeenCalled();
    }
  });
});

describe('getMyData', () => {
  const mockUserMyData: IGetMyUserDataModel = {
    name: 'test',
    email: 'test@test.com',
  };
  const mockUserId = '1';

  test('successfully retrieved user data', async () => {
    //Arrange
    userRepository.getUserById = jest.fn().mockResolvedValue(mockUserMyData);

    //Act
    const userData = await userService.getMyData(mockUserId);

    //Assert
    expect(userData).toStrictEqual(mockUserMyData);
    expect(userRepository.getUserById).toHaveBeenLastCalledWith(mockUserId);
  });

  test('User not found', async () => {
    //Arrange
    userRepository.getUserById = jest.fn().mockResolvedValue(undefined);

    //Act
    try {
      await userService.getMyData(mockUserId);
    } catch (err) {
      //Assert
      expect(err).toEqual(notFoundError('A felhasználó nem létezik.'));
      expect(userRepository.getUserById).toHaveBeenLastCalledWith(mockUserId);
    }
  });

  test('repository error', async () => {
    //Arrange
    userRepository.getUserById = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await userService.getMyData(mockUserId);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(userRepository.getUserById).toHaveBeenLastCalledWith(mockUserId);
    }
  });
});

describe('update username', () => {
  const modifiedUserName: IChangeUserNameDataModel = {
    name: 'test',
    id: '19',
  };

  test('successfully updating username', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 1,
    };
    userRepository.getUserById = jest
      .fn()
      .mockResolvedValue(modifiedUserName.id);
    userRepository.changeUserName = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    await userService.changeUserName(modifiedUserName);

    //Assert
    expect(userRepository.getUserById).toHaveBeenCalledWith(
      modifiedUserName.id,
    );
    expect(userRepository.changeUserName).toHaveBeenCalledWith(
      modifiedUserName,
    );
  });

  test('user is not found', async () => {
    //Arrange
    userRepository.getUserById = jest.fn().mockResolvedValue(undefined);

    //Act
    try {
      await userService.changeUserName(modifiedUserName);
    } catch (err) {
      //Assert
      expect(err).toEqual(notFoundError('A felhasználó nem található.'));
      expect(userRepository.getUserById).toHaveBeenLastCalledWith(
        modifiedUserName.id,
      );
    }
  });

  test('should create servererror if affectedrows is 0', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 0,
    };
    userRepository.getUserById = jest
      .fn()
      .mockResolvedValue(modifiedUserName.id);
    userRepository.changeUserName = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    try {
      await userService.changeUserName(modifiedUserName);
    } catch (err) {
      //Assert
      expect(err).toEqual(
        serverError('Nem sikerült megváltoztatni a felhasználónevet.'),
      );
      expect(userRepository.getUserById).toHaveBeenLastCalledWith(
        modifiedUserName.id,
      );
      expect(userRepository.changeUserName).toHaveBeenCalledWith(
        modifiedUserName,
      );
    }
  });

  test('repository error', async () => {
    //Arrange
    userRepository.getUserById = jest
      .fn()
      .mockResolvedValue(modifiedUserName.id);
    userRepository.changeUserName = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await userService.changeUserName(modifiedUserName);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(userRepository.getUserById).toHaveBeenLastCalledWith(
        modifiedUserName.id,
      );
      expect(userRepository.changeUserName).toHaveBeenCalledWith(
        modifiedUserName,
      );
    }
  });
});
