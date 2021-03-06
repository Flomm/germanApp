import { NextFunction, Request, Response } from 'express';
import IUserRegistrationRequest from '../../models/requests/IUserRegistrationRequest';
import IUserVerificationRequest from '../../models/requests/IUserVerificationRequest';
import IUserRegistrationResponse from '../../models/responses/IUserRegistrationResponse';
import IUserLoginRequest from '../../models/requests/IUserLoginRequest';
import IUserLoginResponse from '../../models/responses/IUserLoginResponse';
import IUserVerificationResponse from '../../models/responses/IUserVerificationResponse';
import { jwtService } from '../../services/jwtService/jwtService';
import { userService } from '../../services/userService/userService';
import IRegisterUserDataModel from '../../models/models/dataModels/IRegisterUserDataModel';
import ICustomResponse from '../../models/responses/ICustomResponse';
import IPasswordRecoveryRequest from '../../models/requests/IPasswordRecoveryRequest';
import IGetUserResponse from '../../models/responses/IGetUserResponse';
import INewPasswordAddingRequest from '../../models/requests/INewPasswordAddingRequest';
import { notAcceptableError } from '../../services/errorCreatorService/errorCreatorService';
import IGetMyUserDataResponse from '../../models/responses/IGetMyUserDataResponse';
import IChangeUserNameDataModel from '../../models/models/dataModels/IChangeUserNameDataModel';
import IChangePasswordRequest from '../../models/requests/IChangePasswordRequest';

export const userController = {
  getAllUsers(
    req: Request,
    res: Response<IGetUserResponse>,
    next: NextFunction,
  ): void {
    userService
      .getAllUsers()
      .then(users => {
        res.status(200).json({ userList: users });
      })
      .catch(err => {
        return next(err);
      });
  },

  registerUser(
    req: Request<IUserRegistrationRequest>,
    res: Response<IUserRegistrationResponse>,
    next: NextFunction,
  ): void {
    const newRegistration: IRegisterUserDataModel = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      roleId: 2,
    };
    if (!userController.checkPassword(newRegistration.password)) {
      return next(
        notAcceptableError(
          'A jelsz?? legal??bb 6 karakter kell legyen ??s tartalmaznia kell egy sz??mot.',
        ),
      );
    }
    userService
      .registerUser(newRegistration)
      .then(() => {
        res.status(201).json({ message: 'Sikeres regisztr??ci??.' });
      })
      .catch(err => {
        next(err);
        return;
      });
  },

  verifyUser(
    req: Request<IUserVerificationRequest>,
    res: Response<IUserVerificationResponse>,
    next: NextFunction,
  ): void {
    const { email, verificationCode } = req.body;

    userService
      .verifyUser(email, verificationCode)
      .then(() => {
        res.status(200).json({ message: 'Sikeres meger??s??t??s.' });
      })
      .catch(err => {
        next(err);
        return;
      });
  },

  loginUser(
    req: Request<IUserLoginRequest>,
    res: Response<IUserLoginResponse>,
    next: NextFunction,
  ): void {
    const { email, password } = req.body;
    userService
      .loginUser({ email, password })
      .then(user => {
        res.status(200).json({
          name: user.name,
          roleId: user.roleId,
          token: jwtService.generateAccessToken(
            user.id,
            user.email,
            user.roleId,
          ),
        });
      })
      .catch(err => {
        return next(err);
      });
  },

  recoverPassword(
    req: Request<IPasswordRecoveryRequest>,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ): void {
    userService
      .recoverUserPasswordByEmail(req.body.email)
      .then(() => {
        res
          .status(200)
          .json({ message: 'A jelsz?? vissza??ll??t?? k??d sikeresen elk??ldve.' });
      })
      .catch(err => {
        return next(err);
      });
  },

  updatePassword(
    req: Request<INewPasswordAddingRequest>,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ): void {
    const { email, passwordRecoveryCode, password } = req.body;

    if (!userController.checkPassword(req.body.password)) {
      return next(
        notAcceptableError(
          'A jelsz?? legal??bb 6 karakter kell legyen ??s tartalmaznia kell egy sz??mot.',
        ),
      );
    }
    userService
      .updatePassword(email, passwordRecoveryCode, password)
      .then(() => {
        res.status(200).json({ message: '??j jelsz?? hozz??adva.' });
      })
      .catch(err => {
        return next(err);
      });
  },

  changePassword(
    req: Request,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ): void {
    const changePasswordReq: IChangePasswordRequest = req.body;

    if (!userController.checkPassword(changePasswordReq.newPassword)) {
      return next(
        notAcceptableError(
          'A jelsz?? legal??bb 6 karakter kell legyen ??s tartalmaznia kell egy sz??mot.',
        ),
      );
    }

    const token: string = jwtService.getTokenFromRequest(req)!;
    const userId: string = jwtService.getUserIdFromToken(token).toString();

    userService
      .changePassword(userId, changePasswordReq)
      .then(() => {
        res.status(200).json({ message: 'Jelsz?? sikeresen megv??ltoztatva.' });
      })
      .catch(err => {
        return next(err);
      });
  },

  checkPassword(password: string): boolean {
    const passwordPattern = /^(?=.*\d)(?=.*[a-z]).{6,}$/;
    return passwordPattern.test(password);
  },

  getMyData(
    req: Request,
    res: Response<IGetMyUserDataResponse>,
    next: NextFunction,
  ): void {
    const token: string = jwtService.getTokenFromRequest(req)!;
    const userId: string = jwtService.getUserIdFromToken(token).toString();
    userService
      .getMyData(userId)
      .then(userData => res.status(200).json({ userData: userData }))
      .catch(err => {
        return next(err);
      });
  },

  changeUserName(
    req: Request,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ): void {
    const token: string = jwtService.getTokenFromRequest(req)!;
    const userId: string = jwtService.getUserIdFromToken(token).toString();
    const modifiedUserName: IChangeUserNameDataModel = {
      name: req.body.name,
      id: userId,
    };
    userService
      .changeUserName(modifiedUserName)
      .then(() => {
        res
          .status(200)
          .json({ message: 'A felhaszn??l??n??v sikeresen megv??ltoztatva.' });
      })
      .catch(err => {
        return next(err);
      });
  },
};
