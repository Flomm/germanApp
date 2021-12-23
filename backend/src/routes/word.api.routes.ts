import express from 'express';
import { wordController } from '../controllers/wordController/wordController';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';
import permitChecker from '../middlewares/permitChecker/permitChecker';
import { bodyValidator } from '../middlewares/requestValidator/requestValidator';
import { UserRole } from '../models/models/Enums/UserRole.enum';

export const wordRouter = express.Router();

/**
 * @swagger
 * paths:
 *  /api/word:
 *    get:
 *      tags:
 *        - WORD
 *      summary: List words as Admin
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      responses:
 *        '200':
 *          description: The resource has been fetched and is transmitted in the message body.
 *          content:
 *              schema:
 *               $ref: "#/definitions/getWord"
 *        '403':
 *          description: User is not an admin
 *        '500':
 *          description: Internal Server Error.
 * definitions:
 *  getWord:
 *      type: object
 *      properties:
 *          word:
 *              type: string
 *          id:
 *              type: integer
 *          transition:
 *              type: array
 */
wordRouter
  .route('/:lang')
  .all(tokenAuthentication(), permitChecker([UserRole.Admin]))
  .get(wordController.getAllWords);

wordRouter
  .route('/:lang/')
  .all(
    tokenAuthentication(),
    permitChecker([UserRole.Admin]),
    bodyValidator(['word', 'translations']),
  )
  .post(wordController.addWord);

wordRouter
  .route('/:lang/:id')
  .all(tokenAuthentication(), permitChecker([UserRole.Admin]))
  .delete(wordController.removeWord);

wordRouter
  .route('/:lang/:id')
  .all(
    tokenAuthentication(),
    permitChecker([UserRole.Admin]),
    bodyValidator(['word', 'translations']),
  )
  .put(wordController.modifyWord);
