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
            conflictError('M??r regisztr??lva vagy, k??rlek jelentkezz be.'),
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
              'K??sz??nj??k a regisztr??ci??t! Kattints a lenti gombra a meger??s??t??shez!',
            buttonText: 'Regisztr??ci?? meger??s??t??se',
            url: `http://localhost:4200/email/verify?code=${verificationCode}&email=${registration.email}`,
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
            Subject: 'Regisztr??ci?? meger??s??t??se a n??mettanul?? alkalmaz??shoz',
            HTMLPart: emailService.readTemplate(
              templatePath,
              emailReplacements,
            ),
          };
          emailService.sendMailJetMail(email).catch(err => {
            console.log(`Mailjet API error: ${err}`);
            return Promise.reject(
              serverError(
                'Hiba az e-mail k??ld??se k??zben, k??rj??k pr??b??lja ??jra.',
              ),
            );
          });
        }
        return Promise.reject(serverError('Sikertelen regiszt??ci??.'));
      })
      .catch(err => Promise.reject(err));
  },

  verifyUser(email: string, verificationCode: number): Promise<void> {
    let userId: number;
    return userRepository
      .getUserByEmail(email)
      .then(async user => {
        if (!user) {
          return Promise.reject(notFoundError('E-mail c??m nem tal??lhat??.'));
        }
        if (user.verificationCode !== verificationCode) {
          return Promise.reject(badRequestError('Hib??s meger??s??t?? k??d.'));
        }
        if (user.isVerified === 1) {
          return Promise.reject(
            conflictError('A regisztr??ci?? m??r meg van er??s??tve.'),
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
        return Promise.reject(serverError('Sikertelen meger??s??t??s.'));
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
              unauthorizedError('E-mail vagy jelsz?? helytelen.'),
            );
          }
          if (user.isVerified !== 1) {
            return Promise.reject(
              forbiddenError('Ez az e-mail c??m m??g nincs meger??s??tve.'),
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
          return Promise.reject(notFoundError('E-mail nem tal??lhat??.'));
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
            instructions: 'Kattints az al??bbi gombra ??j jelsz?? megad??s??hoz!',
            buttonText: '??j jelsz??',
            url: `http://localhost:4200/new-password?email=${userEmail}&code=${passwordRecoveryCode}`,
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
            Subject: 'Elfelejtett jelsz?? a n??mettanul?? alkalmaz??shoz',
            HTMLPart: emailService.readTemplate(
              templatePath,
              emailReplacements,
            ),
          };
          return emailService.sendMailJetMail(email).catch(err => {
            console.log(`Mailjet API error: ${err}`);
            return Promise.reject(
              serverError(
                'Hiba az e-mail k??ld??se k??zben, k??rj??k pr??b??lja ??jra.',
              ),
            );
          });
        }
        return Promise.reject(serverError('Sikertelen jelsz??vissza??ll??t??s.'));
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
          return Promise.reject(notFoundError('E-mail nem tal??lhat??.'));
        }

        if (user.passwordRecoveryCode !== passwordRecoveryCode) {
          return Promise.reject(
            badRequestError('??rv??nytelen jelsz??vissza??ll??t?? k??d.'),
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
        return Promise.reject(serverError('Sikertelen regisztr??ci??.'));
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
        throw unauthorizedError('A megadott r??gi jelsz?? helytelen.');
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
      throw serverError('Sikertelen regisztr??ci??.');
    } catch (err) {
      return Promise.reject(err);
    }
  },

  getMyData(id: string): Promise<IGetMyUserDataModel> {
    return userRepository
      .getUserById(id)
      .then(userData => {
        if (!userData) {
          return Promise.reject(notFoundError('A felhaszn??l?? nem l??tezik.'));
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
          return Promise.reject(notFoundError('A felhaszn??l?? nem tal??lhat??.'));
        }
        return await userRepository.changeUserName(newUserName);
      })
      .then(result => {
        if (result && result.affectedRows > 0) {
          return;
        }
        return Promise.reject(
          serverError('Nem siker??lt megv??ltoztatni a felhaszn??l??nevet.'),
        );
      })
      .catch(err => Promise.reject(err));
  },
};
