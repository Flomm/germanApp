import config from '../../config';
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
import IMailjetMail from '../../models/IMailjetMail';
import IChangePasswordRequest from '../../models/requests/IChangePasswordRequest';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';

const templatePath = '../../models/templates/email-template.html';

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
            url: `${config.frontend.frontendUrl}/auth/verify?code=${verificationCode}&email=${registration.email}`,
          };
          const email: IMailjetMail = {
            From: {
              Email: config.mailJet.user as string,
              Name: config.mailJet.name as string,
            },
            To: [
              {
                Email: `${registration.email}`,
              },
            ],
            Subject: 'Regisztráció megerősítése a némettanuló alkalmazáshoz',
            HTMLPart: emailService.readTemplate(
              templatePath,
              emailReplacements,
            ),
          };
          return emailService.sendMailJetMail(email).catch(err => {
            console.log(`Mailjet API error: ${err}`);
            return Promise.reject(
              serverError(
                'Hiba az e-mail küldése közben, kérjük próbálja újra.',
              ),
            );
          });
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
            url: `${config.frontend.frontendUrl}/auth/new-password?email=${userEmail}&code=${passwordRecoveryCode}`,
          };
          const email: IMailjetMail = {
            From: {
              Email: config.mailJet.user as string,
              Name: config.mailJet.name as string,
            },
            To: [
              {
                Email: `${userEmail}`,
              },
            ],
            Subject: 'Elfelejtett jelszó a némettanuló alkalmazáshoz',
            HTMLPart: emailService.readTemplate(
              templatePath,
              emailReplacements,
            ),
          };
          return emailService.sendMailJetMail(email).catch(err => {
            console.log(`Mailjet API error: ${err}`);
            return Promise.reject(
              serverError(
                'Hiba az e-mail küldése közben, kérjük próbálja újra.',
              ),
            );
          });
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

  async changePassword(
    userId: string,
    passwordChangeReq: IChangePasswordRequest,
  ): Promise<void> {
    try {
      const user: IUserDomainModel = await userRepository.getAllUserDataById(
        userId,
      );
      if (
        !hashPasswordService.comparePasswords(
          passwordChangeReq.oldPassword,
          user.password,
        )
      ) {
        throw unauthorizedError('A megadott régi jelszó helytelen.');
      }
      const newPasswordData: IUpdatePasswordDataModel = {
        id: user.id,
        password: hashPasswordService.generateHash(
          passwordChangeReq.newPassword,
        ),
      };

      const updateResult: IDbResultDataModel =
        await userRepository.updatePassword(newPasswordData);

      if (updateResult && updateResult.affectedRows > 0) {
        return;
      }
      throw serverError('Sikertelen regisztráció.');
    } catch (err) {
      return Promise.reject(err);
    }
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
