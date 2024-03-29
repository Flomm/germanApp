import { db } from '../../data/connection';
import IRegisterUserDataModel from '../../models/models/dataModels/IRegisterUserDataModel';
import IUserDomainModel from '../../models/models/domainModels/IUserDomainModel';
import IPasswordRecoveryDataModel from '../../models/models/dataModels/IPasswordRecoveryDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IGetUserDataModel from '../../models/models/dataModels/IGetUserDataModel';
import IUpdatePasswordDataModel from '../../models/models/dataModels/IUpdatePasswordDataModel';
import IGetMyUserDataModel from '../../models/models/dataModels/IGetMyUserDataModel';
import IChangeUserNameDataModel from '../../models/models/dataModels/IChangeUserNameDataModel';
import config from '../../config';

export const userRepository = {
  getAllUsers(): Promise<IGetUserDataModel[]> {
    return db
      .query<IGetUserDataModel[]>(
        `SELECT name, email, isVerified, roleId FROM ${config.mysql.database}.user`,
        [],
      )
      .catch(err => Promise.reject(err));
  },

  getUserByEmail(email: string): Promise<IUserDomainModel> {
    return db
      .query<IUserDomainModel[]>(
        `SELECT * FROM ${config.mysql.database}.user WHERE email = ?`,
        [email],
      )
      .then(dbResult => dbResult[0])
      .catch(err => Promise.reject(err));
  },

  getAllUserDataById(id: string): Promise<IUserDomainModel> {
    return db
      .query<IUserDomainModel[]>(
        `SELECT * FROM ${config.mysql.database}.user WHERE id = ?`,
        [id],
      )
      .then(dbResult => dbResult[0])
      .catch(err => Promise.reject(err));
  },

  getUserById(id: string): Promise<IGetMyUserDataModel> {
    return db
      .query<IGetMyUserDataModel[]>(
        `SELECT name, email FROM ${config.mysql.database}.user WHERE id = ?`,
        [id],
      )
      .then(dbResult => dbResult[0])
      .catch(err => Promise.reject(err));
  },

  registerUser(
    registration: IRegisterUserDataModel,
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `INSERT INTO ${config.mysql.database}.user (name, email, password, verificationCode, roleId)
    VALUES (?, ?, ?, ?, ?)`,
        [
          registration.name,
          registration.email,
          registration.password,
          `${registration.verificationCode}`,
          `${registration.roleId}`,
        ],
      )
      .catch(err => Promise.reject(err));
  },

  verifyUser(
    email: string,
    verificationCode: number,
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `UPDATE ${config.mysql.database}.user SET isVerified = 1 WHERE email = ? AND verificationCode = ?`,
        [email, `${verificationCode}`],
      )
      .catch(err => Promise.reject(err));
  },

  recoverPassword(
    passwordRecoveryCodeData: IPasswordRecoveryDataModel,
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `UPDATE ${config.mysql.database}.user SET passwordRecoveryCode = ? WHERE id = ?`,
        [
          `${passwordRecoveryCodeData.passwordRecoveryCode}`,
          `${passwordRecoveryCodeData.id}`,
        ],
      )
      .catch(err => Promise.reject(err));
  },

  updatePassword(
    newPasswordData: IUpdatePasswordDataModel,
  ): Promise<IDbResultDataModel> {
    return db.query<IDbResultDataModel>(
      `UPDATE ${config.mysql.database}.user SET password = ?, passwordRecoveryCode = 0 WHERE id = ?`,
      [newPasswordData.password, `${newPasswordData.id}`],
    );
  },

  changeUserName(
    newUserNameData: IChangeUserNameDataModel,
  ): Promise<IDbResultDataModel> {
    return db.query<IDbResultDataModel>(
      `UPDATE ${config.mysql.database}.user SET name = ? WHERE id = ?`,
      [newUserNameData.name, newUserNameData.id],
    );
  },
};
