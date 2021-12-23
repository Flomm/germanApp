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
 *  /api/word/{lang}:
 *    get:
 *      tags:
 *        - WORD
 *      summary: List words as Admin
 *      security:
 *        - Bearer: []
 *      produces:
 *        - application/json
 *      parameters:
 *      - in: path
 *        name: lang
 *        required: true
 *        schema:
 *          type: string
 *        description: Language
 *      responses:
 *        '200':
 *          description: The resource has been fetched and is transmitted in the message body.
 *          content:
 *              schema:
 *               $ref: "#/definitions/GetWord"
 *        '403':
 *          description: User is not an admin
 *        '500':
 *          description: Internal Server Error.
 * definitions:
 *  GetWord:
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

/**
 * @swagger
 * paths:
 *  /api/word/{lang}:
 *    post:
 *      tags:
 *        - WORD
 *      summary: Add a word as Admin
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
 *        description: Add a word
 *        required: true
 *        schema:
 *          $ref: '#/definitions/AddWord'
 *      responses:
 *        '201':
 *          description: Word was succesfully added
 *        '400':
 *          description: A field is missing
 *        '403':
 *          description: User is not an admin
 *        '500':
 *          description: Internal server error
 * definitions:
 *  AddWord:
 *      type: object
 *      properties:
 *          word:
 *              type: string
 *          gender:
 *              type: string
 *          translations:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  translation:
 *                    type: string
 *                  gender:
 *                    type: string
 */
wordRouter
  .route('/:lang/')
  .all(
    tokenAuthentication(),
    permitChecker([UserRole.Admin]),
    bodyValidator(['word', 'translations']),
  )
  .post(wordController.addWord);

/**
 * @swagger
 * paths:
 *  /api/word/{lang}/{id}:
 *    delete:
 *      tags:
 *        - WORD
 *      summary: Remove word as Admin
 *      security:
 *        - Bearer: []
 *      parameters:
 *        - name: lang
 *          in: path
 *          required: true
 *          description: Language
 *          schema:
 *            type: string
 *        - name: id
 *          in: path
 *          required: true
 *          description: Word id
 *          schema:
 *            type: integer
 *            format: int64
 *            minimum: 1
 *      responses:
 *        '200':
 *          description: Word has been removed successfully
 *        '403':
 *          description: User is not an admin
 *        '404':
 *          description: Word with the specified ID was not found.
 *        '500':
 *          description: Server-side error.
 */
wordRouter
  .route('/:lang/:id')
  .all(tokenAuthentication(), permitChecker([UserRole.Admin]))
  .delete(wordController.removeWord);

/**
 * @swagger
 * paths:
 *  /api/ticket/{lang}/{id}:
 *    put:
 *      tags:
 *        - WORD
 *      summary: Update a word as Admin
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
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *          minimum: 1
 *        description: Word id
 *      - in: body
 *        name: body
 *        description: Modify a word
 *        required: true
 *        schema:
 *          $ref: '#/definitions/AddWord'
 *      responses:
 *        '200':
 *          description: Word has been succesfully updated
 *        '400':
 *          description: A field is missing
 *        '403':
 *          description: User is not an admin
 *        '500':
 *          description: Internal server error
 */
wordRouter
  .route('/:lang/:id')
  .all(
    tokenAuthentication(),
    permitChecker([UserRole.Admin]),
    bodyValidator(['word', 'translations']),
  )
  .put(wordController.modifyWord);
