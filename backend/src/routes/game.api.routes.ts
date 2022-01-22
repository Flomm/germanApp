import express from 'express';
import { gameController } from '../controllers/gameController/gameController';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';
import permitChecker from '../middlewares/permitChecker/permitChecker';
import {
  bodyValidator,
  queryValidator,
} from '../middlewares/requestValidator/requestValidator';
import { UserRole } from '../models/models/Enums/UserRole.enum';

export const gameRouter = express.Router();

/**
 * @swagger
 * paths:
 *  /api/random-words/{lang}:
 *    get:
 *      tags:
 *        - GAME
 *      summary: Get random words for the game as consumer
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: path
 *        name: lang
 *        required: true
 *        schema:
 *          type: string
 *        description: Language
 *      - in: query
 *        name: quantity
 *        description: Number of random words
 *        required: true
 *        schema:
 *          type: number
 *      responses:
 *        '200':
 *          description: Successfully retrieved words
 *          content:
 *            schema:
 *              $ref: '#/definitions/RandomWordData'
 *        '401':
 *          description: Unauthorized
 *        '403':
 *          description: User is not a consumer
 *        '404':
 *          description: Invalid language or body is not complete
 *        '500':
 *          description: Internal server error
 * definitions:
 *  RandomWordData:
 *      type: object
 *      properties:
 *          id:
 *              type: integer
 *          word:
 *              type: string
 *          gender:
 *              type: string
 *          numOfTranslations:
 *              type: number
 *          topic:
 *              type: number
 */
gameRouter
  .route('/random-words/:lang')
  .all(
    tokenAuthentication(),
    permitChecker([UserRole.Consumer]),
    queryValidator(['quantity']),
  )
  .get(gameController.getRandomWords);

/**
 * @swagger
 * paths:
 *  /api/check-answer/{lang}:
 *    post:
 *      tags:
 *        - GAME
 *      summary: Check if answer is correct as consumer
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: path
 *        name: lang
 *        required: true
 *        schema:
 *          type: string
 *        description: Language
 *      - in: body
 *        name: body
 *        description: Answer details
 *        required: true
 *        schema:
 *          $ref: '#/definitions/CheckAnswerRequest'
 *      responses:
 *        '200':
 *          description: Successfully checked answer
 *        '401':
 *          description: Unauthorized
 *        '403':
 *          description: User is not a consumer
 *        '404':
 *          description: Invalid language or body is not complete
 *        '500':
 *          description: Internal server error
 * definitions:
 *  CheckAnswerRequest:
 *      type: object
 *      properties:
 *          wordId:
 *              type: integer
 *          answerList:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  answer:
 *                    type: string
 *                  gender:
 *                    type: string
 *  CheckAnswerResponse:
 *      type: object
 *      properties:
 *          wordId:
 *              type: integer
 *          answerList:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  answer:
 *                    type: string
 *                  gender:
 *                    type: string
 */
gameRouter
  .route('/check-answer/:lang')
  .all(
    tokenAuthentication(),
    permitChecker([UserRole.Consumer]),
    bodyValidator(['wordId', 'answerList']),
  )
  .post(gameController.checkAnswer);
