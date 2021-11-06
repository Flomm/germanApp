import config from '../../config';
import { IEmail } from '../../models/IEmail';
import IGetUserDataModel from '../../models/models/dataModels/IGetUserDataModel';
import ILoginUserDataModel from '../../models/models/dataModels/ILoginUserDataModel';
import IPasswordRecoveryDataModel from '../../models/models/dataModels/IPasswordRecoveryDataModel';
import IRegisterUserDataModel from '../../models/models/dataModels/IRegisterUserDataModel';
import IUserDomainModel from '../../models/models/domainModels/IUserDomainModel';
import { userRepository } from '../../repository/userRepository/userRepository';
import { codeGeneratorService } from '../codeGeneratorService/codeGenerator.service';
import { emailService } from '../emailService/email.service';
import {
  badRequestError,
  conflictError,
  forbiddenError,
  notFoundError,
  serverError,
  unauthorizedError,
} from '../errorCreatorService/errorCreator.service';
import { hashPasswordService } from '../hashPasswordService/hashPassword.service';
import IUpdatePasswordDataModel from '../../models/models/dataModels/IUpdatePasswordDataModel';
import IEmailReplacements from '../../models/IEmailReplacements';
import IGetMyUserDataModel from '../../models/models/dataModels/IGetMyUserDataModel';
import IChangeUserNameDataModel from '../../models/models/dataModels/IChangeUserNameDataModel';

const templatePath: string = '../../models/templates/email-template.html';

export const userService = {
  getAllUsers(): Promise<IGetUserDataModel[]> {
    return userRepository.getAllUsers().catch(err => Promise.reject(err));
  },

  registerUser(registration: IRegisterUserDataModel): Promise<void> {
    const verificationCode: number = codeGeneratorService.generateSixDigitCode();

    return userRepository
      .getUserByEmail(registration.email)
      .then(async user => {
        if (user) {
          return Promise.reject(
            conflictError('You are already registered, please log in'),
          );
        }

        const newRegistration: IRegisterUserDataModel = {
          ...registration,
          password: hashPasswordService.generateHash(registration.password),
          verificationCode: verificationCode,
        };
        return await userRepository.registerUser(newRegistration);
      })
      .then(result => {
        if (result && result.affectedRows > 0) {
          const emailReplacements: IEmailReplacements = {
            userName: registration.name,
            instructions:
              'Thanks for your registration! Please click on the button below to confirm it!',
            buttonText: 'Confirm registration',
            url: `http://localhost:4200/email/verify?code=${verificationCode}&email=${registration.email}`,
          };
          const email: IEmail = {
            from: config.transporter.auth.user!,
            to: `${registration.email}`,
            subject: 'Registration confirmation for FoxTicket',
            html: emailService.readTemplate(templatePath, emailReplacements),
          };
          emailService.sendEmail(email);
          return;
        }
        return Promise.reject(serverError('Cannot add registration'));
      })
      .catch(err => Promise.reject(err));
  },

  verifyUser(email: string, verificationCode: number): Promise<void> {
    return userRepository
      .getUserByEmail(email)
      .then(async user => {
        if (!user) {
          return Promise.reject(notFoundError('E-mail is not found'));
        }
        if (user.verificationCode !== verificationCode) {
          return Promise.reject(
            badRequestError('Verification is unsuccessful'),
          );
        }
        if (user.isVerified === 1) {
          return Promise.reject(conflictError('You are already verified'));
        }
        return await userRepository.verifyUser(email, verificationCode);
      })
      .then(result => {
        if (result && result.affectedRows > 0) {
          return;
        }
        return Promise.reject(serverError('User cannot be verified'));
      })
      .catch(err => Promise.reject(err));
  },

  loginUser(loginRequest: ILoginUserDataModel): Promise<IUserDomainModel> {
    {
      return userRepository
        .getUserByEmail(loginRequest.email)
        .then(async user => {
          if (
            !user ||
            !hashPasswordService.comparePasswords(
              loginRequest.password,
              user.password,
            )
          ) {
            return Promise.reject(
              unauthorizedError('E-mail or password is incorrect'),
            );
          }
          if (user.isVerified !== 1) {
            return Promise.reject(
              forbiddenError('E-mail has not been verified yet'),
            );
          }
          return Promise.resolve(user);
        })
        .catch(err => Promise.reject(err));
    }
  },

  recoverUserPasswordByEmail(userEmail: string): Promise<void> {
    const passwordRecoveryCode: number =
      codeGeneratorService.generateSixDigitCode();
    let userName: string;

    return userRepository
      .getUserByEmail(userEmail)
      .then(async user => {
        if (!user) {
          return Promise.reject(notFoundError('E-mail is not found'));
        }
        userName = user.name;
        const passwordRecoveryCodeData: IPasswordRecoveryDataModel = {
          id: user.id,
          passwordRecoveryCode: passwordRecoveryCode,
        };
        return await userRepository.recoverPassword(passwordRecoveryCodeData);
      })
      .then(result => {
        if (result && result.affectedRows > 0) {
          const emailReplacements: IEmailReplacements = {
            userName: userName,
            instructions:
              'Please click on the button below to reset your password!',
            buttonText: 'Recover password',
            url: `http://localhost:4200/new-password?email=${userEmail}&code=${passwordRecoveryCode}`,
          };
          const email: IEmail = {
            from: config.transporter.auth.user!,
            to: `${userEmail}`,
            subject: 'Password recovery for FoxTicket',
            html: emailService.readTemplate(templatePath, emailReplacements),
          };
          emailService.sendEmail(email);
          return;
        }
        return Promise.reject(serverError('Cannot recover password'));
      })
      .catch(err => Promise.reject(err));
  },

  updatePassword(
    email: string,
    passwordRecoveryCode: number,
    password: string,
  ): Promise<void> {
    return userRepository
      .getUserByEmail(email)
      .then(async user => {
        if (!user) {
          return Promise.reject(notFoundError('E-mail is not found'));
        }

        if (user.passwordRecoveryCode !== passwordRecoveryCode) {
          return Promise.reject(
            badRequestError('Invalid password recovery code'),
          );
        }

        const newPasswordData: IUpdatePasswordDataModel = {
          id: user.id,
          password: hashPasswordService.generateHash(password),
        };

        return await userRepository.updatePassword(newPasswordData);
      })
      .then(result => {
        if (result && result.affectedRows > 0) {
          return;
        }
        return Promise.reject(serverError('Cannot add registration'));
      })
      .catch(err => Promise.reject(err));
  },

  getMyData(id: string): Promise<IGetMyUserDataModel> {
    return userRepository
      .getUserById(id)
      .then(userData => {
        if (!userData) {
          return Promise.reject(notFoundError('User does not exist'));
        }
        return userData;
      })
      .catch(err => Promise.reject(err));
  },

  changeUserName(newUserName: IChangeUserNameDataModel): Promise<void> {
    return userRepository
      .getUserById(newUserName.id)
      .then(async user => {
        if (!user) {
          return Promise.reject(notFoundError('User is not found'));
        }
        return await userRepository.changeUserName(newUserName);
      })
      .then(result => {
        if (result && result.affectedRows > 0) {
          return;
        }
        return Promise.reject(serverError('Cannot change username'));
      })
      .catch(err => Promise.reject(err));
  },
};
