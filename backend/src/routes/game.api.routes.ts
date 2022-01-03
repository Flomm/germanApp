import express from 'express';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';
import permitChecker from '../middlewares/permitChecker/permitChecker';
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
 */
gameRouter
  .route('/random-words/:lang')
  .all(tokenAuthentication(), permitChecker([UserRole.Consumer]))
  .get();
