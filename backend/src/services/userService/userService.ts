import config from '../../config';
import { IEmail } from '../../models/IEmail';
import IGetUserDataModel from '../../models/models/dataModels/IGetUserDataModel';
import ILoginUserDataModel from '../../models/models/dataModels/ILoginUserDataModel';
import IPasswordRecoveryDataModel from '../../models/models/dataModels/IPasswordRecoveryDataModel';
import IRegisterUserDataModel from '../../models/models/dataModels/IRegisterUserDataModel';
import IUserDomainModel from '../../models/models/domainModels/IUserDomainModel';
import { userRepository } from '../../repository/userRepository/userRepository';
import { codeGeneratorService } from '../codeGeneratorService/codeGeneratorService';
import { emailService } from '../emailService/emailService';
import {
  badRequestError,
  conflictError,
  forbiddenError,
  notFoundError,
  serverError,
  unauthorizedError,
} from '../errorCreatorService/errorCreatorService';
import { hashPasswordService } from '../hashPasswordService/hashPasswordService';
import IUpdatePasswordDataModel from '../../models/models/dataModels/IUpdatePasswordDataModel';
import IEmailReplacements from '../../models/IEmailReplacements';
import IGetMyUserDataModel from '../../models/models/dataModels/IGetMyUserDataModel';
import IChangeUserNameDataModel from '../../models/models/dataModels/IChangeUserNameDataModel';
import { statisticsService } from '../statisticsService/statisticsService';

const templatePath: string = '../../models/templates/email-template.html';

export const userService = {
  getAllUsers(): Promise<IGetUserDataModel[]> {
    return userRepository.getAllUsers().catch(err => Promise.reject(err));
  },

  registerUser(registration: IRegisterUserDataModel): Promise<void> {
    const verificationCode: number =
      codeGeneratorService.generateSixDigitCode();

    return userRepository
      .getUserByEmail(registration.email)
      .then(async user => {
        if (user) {
          return Promise.reject(
            conflictError('Már regisztrálva vagy, kérlek jelentkezz be.'),
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
              'Köszönjük a regisztrációt! Kattints a lenti gombra a megerősítéshez!',
            buttonText: 'Regisztráció megerősítése',
            url: `http://localhost:4200/email/verify?code=${verificationCode}&email=${registration.email}`,
          };
          const email: IEmail = {
            from: config.transporter.auth.user!,
            to: `${registration.email}`,
            subject: 'Regisztráció megerősítése a némettanuló alkalmazáshoz',
            html: emailService.readTemplate(templatePath, emailReplacements),
          };
          emailService.sendEmail(email);
          return;
        }
        return Promise.reject(serverError('Sikertelen regisztáció.'));
      })
      .catch(err => Promise.reject(err));
  },

  verifyUser(email: string, verificationCode: number): Promise<void> {
    let userId: number;
    return userRepository
      .getUserByEmail(email)
      .then(async user => {
        if (!user) {
          return Promise.reject(notFoundError('E-mail cím nem található.'));
        }
        if (user.verificationCode !== verificationCode) {
          return Promise.reject(badRequestError('Hibás megerősítő kód.'));
        }
        if (user.isVerified === 1) {
          return Promise.reject(
            conflictError('A regisztráció már meg van erősítve.'),
          );
        }
        userId = user.id;
        return await userRepository.verifyUser(email, verificationCode);
      })
      .then(result => {
        if (result && result.affectedRows > 0) {
          return statisticsService
            .createNewStatistics(userId.toString())
            .then(() => {
              return;
            })
            .catch(err => Promise.reject(err));
        }
        return Promise.reject(serverError('Sikertelen megerősítés.'));
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
              unauthorizedError('E-mail vagy jelszó helytelen.'),
            );
          }
          if (user.isVerified !== 1) {
            return Promise.reject(
              forbiddenError('Ez az e-mail cím még nincs megerősítve.'),
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
          return Promise.reject(notFoundError('E-mail nem található.'));
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
            instructions: 'Kattints az alábbi gombra új jelsző megadásához!',
            buttonText: 'Új jelszó',
            url: `http://localhost:4200/new-password?email=${userEmail}&code=${passwordRecoveryCode}`,
          };
          const email: IEmail = {
            from: config.transporter.auth.user!,
            to: `${userEmail}`,
            subject: 'Elfelejtett jelszó a némettanuló alkalmazáshoz',
            html: emailService.readTemplate(templatePath, emailReplacements),
          };
          emailService.sendEmail(email);
          return;
        }
        return Promise.reject(serverError('Sikertelen jelszóvisszaállítás.'));
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
          return Promise.reject(notFoundError('E-mail nem található.'));
        }

        if (user.passwordRecoveryCode !== passwordRecoveryCode) {
          return Promise.reject(
            badRequestError('Érvénytelen jelszóvisszaállító kód.'),
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
        return Promise.reject(serverError('Sikertelen regisztráció.'));
      })
      .catch(err => Promise.reject(err));
  },

  getMyData(id: string): Promise<IGetMyUserDataModel> {
    return userRepository
      .getUserById(id)
      .then(userData => {
        if (!userData) {
          return Promise.reject(notFoundError('A felhasználó nem létezik.'));
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
          return Promise.reject(notFoundError('A felhasználó nem található.'));
        }
        return await userRepository.changeUserName(newUserName);
      })
      .then(result => {
        if (result && result.affectedRows > 0) {
          return;
        }
        return Promise.reject(
          serverError('Nem sikerült megváltoztatni a felhasználónevet.'),
        );
      })
      .catch(err => Promise.reject(err));
  },
};
