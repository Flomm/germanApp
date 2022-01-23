import express from 'express';
import { userController } from '../controllers/userController/userController';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';
import permitChecker from '../middlewares/permitChecker/permitChecker';
import { bodyValidator } from '../middlewares/requestValidator/requestValidator';
import { UserRole } from '../models/models/Enums/UserRole.enum';

export const userRouter = express.Router();

/**
 * @swagger
 * paths:
 *  /api/user:
 *    get:
 *      tags:
 *        - USER
 *      summary: List users as Admin
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      responses:
 *        '200':
 *          description: The resource has been fetched and is transmitted in the message body.
 *          content:
 *              schema:
 *               $ref: "#/definitions/GetUser"
 *        '403':
 *          description: User is not an admin
 *        '500':
 *          description: Internal Server Error.
 * definitions:
 *  GetUser:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *          email:
 *              type: string
 *          isVerified:
 *              type: integer
 *          roleId:
 *              type: integer
 */
userRouter
  .route('/')
  .all(tokenAuthentication(), permitChecker([UserRole.Admin]))
  .get(userController.getAllUsers);

/**
 * @swagger
 * paths:
 *  /api/user/verify:
 *      put:
 *          tags:
 *            - USER
 *          summary: Verify user
 *          produces:
 *            - application/json
 *          parameters:
 *          - in: body
 *            name: body
 *            description: Verifying the user
 *            required: true
 *            schema:
 *              $ref: '#/definitions/UserVerification'
 *          responses:
 *              '200':
 *                  description: Verification is successful
 *              '400':
 *                  description: Verification is unsuccessful
 *              '404':
 *                  description: E-mail is not found
 *              '409':
 *                  description: You are already verified
 * definitions:
 *  UserVerification:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *          verificationCode:
 *              type: number
 */
userRouter
  .route('/verify')
  .all(bodyValidator(['email', 'verificationCode']))
  .put(userController.verifyUser);

/**
 * @swagger
 * paths:
 *  /api/user/register:
 *      post:
 *          tags:
 *            - USER
 *          summary: Register user
 *          produces:
 *            - application/json
 *          parameters:
 *          - in: body
 *            name: body
 *            description: Register the user
 *            required: true
 *            schema:
 *              $ref: '#/definitions/UserRegistration'
 *          responses:
 *              '201':
 *                  description: Registration was successful
 *              '400':
 *                  description: Please fill out all the fields
 *              '406':
 *                  description: Password must be at least 6 characters and contain letter and number
 *              '409':
 *                  description: You are already registered, please log in
 * definitions:
 *  UserRegistration:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *          email:
 *              type: string
 *          password:
 *              type: string
 */
userRouter
  .route('/register')
  .all(bodyValidator(['name', 'email', 'password']))
  .post(userController.registerUser);

/**
 * @swagger
 * paths:
 *  /api/user/login:
 *      post:
 *          tags:
 *            - USER
 *          summary: User login
 *          produces:
 *            - application/json
 *          parameters:
 *          - in: body
 *            name: body
 *            description: User login
 *            required: true
 *            schema:
 *              $ref: '#/definitions/UserLogin'
 *          responses:
 *              '200':
 *                  description: Login was successful
 *              '400':
 *                  description: Password, e-mail or both are missing.
 *              '401':
 *                  description: E-mail or password is incorrect.
 *              '403':
 *                  description: User is not verified.
 * definitions:
 *  UserLogin:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 */
userRouter
  .route('/login')
  .all(bodyValidator(['email', 'password']))
  .post(userController.loginUser);

/**
 * @swagger
 * paths:
 *  /api/user/password-recovery:
 *      put:
 *          tags:
 *            - USER
 *          summary: User password recovery
 *          produces:
 *            - application/json
 *          parameters:
 *          - in: body
 *            name: body
 *            description: User password recovery
 *            required: true
 *            schema:
 *              $ref: '#/definitions/PasswordRecovery'
 *          responses:
 *              '200':
 *                  description: Password recovery was successful.
 *              '400':
 *                  description: E-mail is required.
 *              '404':
 *                  description: E-mail is not found.
 *              '500':
 *                  description: Internal server error.
 * definitions:
 *  PasswordRecovery:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 */
userRouter
  .route('/password-recovery')
  .all(bodyValidator(['email']))
  .put(userController.recoverPassword);

/**
 * @swagger
 * paths:
 *  /api/user/new-password:
 *      put:
 *          tags:
 *            - USER
 *          summary: Add new password
 *          produces:
 *            - application/json
 *          parameters:
 *          - in: body
 *            name: body
 *            description: New password adding
 *            required: true
 *            schema:
 *              $ref: '#/definitions/NewPasswordAdding'
 *          responses:
 *              '200':
 *                  description: New password is successfully added.
 *              '400':
 *                  description: Invalid password recovery code.
 *              '404':
 *                  description: E-mail is not found.
 *              '406':
 *                  description: Password must be at least 6 characters and contain letter and number.
 *              '500':
 *                  description: Internal server error.
 * definitions:
 *  NewPasswordAdding:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *          passwordRecoveryCode:
 *              type: number
 *          password:
 *              type: string
 */
userRouter
  .route('/new-password')
  .all(bodyValidator(['email', 'passwordRecoveryCode', 'password']))
  .put(userController.updatePassword);

/**
 * @swagger
 * paths:
 *  /api/user/my-data:
 *    get:
 *      tags:
 *        - USER
 *      summary: Request your personal data as a user
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      responses:
 *        '200':
 *          description: The resource has been fetched and is transmitted in the message body.
 *          content:
 *              schema:
 *               $ref: "#/definitions/GetMyUserData"
 *        '403':
 *          description: Token is missing.
 *        '400':
 *          description: User is not found
 *        '500':
 *          description: Internal Server Error.
 * definitions:
 *  GetMyUserData:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *          email:
 *              type: string
 */
userRouter
  .route('/my-data')
  .all(tokenAuthentication(), permitChecker([UserRole.All]))
  .get(userController.getMyData);

/**
 * @swagger
 * paths:
 *  /api/user/change-name:
 *      put:
 *          tags:
 *            - USER
 *          summary: Change username
 *          security:
 *            - Bearer: []
 *          produces:
 *            - application/json
 *          parameters:
 *          - in: body
 *            name: body
 *            description: New username adding
 *            required: true
 *            schema:
 *              $ref: '#/definitions/NewUserNameAdding'
 *          responses:
 *              '200':
 *                  description: Username successfully changed.
 *              '400':
 *                  description: Field is empty.
 *              '404':
 *                  description: User is not found.
 *              '500':
 *                  description: Internal server error.
 * definitions:
 *  NewUserNameAdding:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 */
userRouter
  .route('/change-name')
  .all(tokenAuthentication(), bodyValidator(['name']))
  .put(userController.changeUserName);
