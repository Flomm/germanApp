import express from 'express';
import { statisticsController } from '../controllers/statisticsController/statisticsController';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';
import permitChecker from '../middlewares/permitChecker/permitChecker';
import { bodyValidator } from '../middlewares/requestValidator/requestValidator';
import { UserRole } from '../models/models/Enums/UserRole.enum';

export const statisticsRouter = express.Router();

/**
 * @swagger
 * paths:
 *  /api/statistics/my-statistics:
 *    get:
 *      tags:
 *        - STATISTICS
 *      summary: Request your personal statistics as a user
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
 *  StatisticsData:
 *      type: object
 *      properties:
 *          userId:
 *              type: number
 *          numOfStartedGames:
 *              type: number
 *          numOfFinishedGames:
 *              type: number
 *          numOfCorrectAnswers:
 *              type: number
 *          numOfIncorrectAnswers:
 *              type: number
 */
statisticsRouter
  .route('/my-statistics')
  .all(tokenAuthentication(), permitChecker([UserRole.All]))
  .get(statisticsController.getMyStatistics);

/**
 * @swagger
 * paths:
 *  /api/statistics/increment/{dataType}:
 *    put:
 *      tags:
 *        - STATISTICS
 *      summary: Increment a statistic data as a user
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: dataType
 *        type: number
 *        required: true
 *      responses:
 *        '200':
 *          description: The resource has been fetched and is transmitted in the message body.
 *        '403':
 *          description: Token is missing.
 *        '400':
 *          description: User is not found or incorrect dataType
 *        '500':
 *          description: Internal Server Error.
 */
statisticsRouter
  .route('/increment/')
  .all(
    tokenAuthentication(),
    permitChecker([UserRole.All]),
    bodyValidator(['dataType']),
  )
  .put(statisticsController.incrementStatData);
