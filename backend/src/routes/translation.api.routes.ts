import express from 'express';
import { translationController } from '../controllers/translationController/translationController';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';
import permitChecker from '../middlewares/permitChecker/permitChecker';
import { UserRole } from '../models/models/Enums/UserRole.enum';

export const translationRouter = express.Router();

/**
 * @swagger
 * paths:
 *  /api/translation/{lang}/{id}:
 *    get:
 *      tags:
 *        - TRANSLATION
 *      summary: Get translations for a word as admin
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: path
 *        name: lang
 *        type: string
 *        required: true
 *      - in: path
 *        name: id
 *        type: number
 *        required: true
 *      responses:
 *        '200':
 *          description: The resource has been fetched and is transmitted in the message body.
 *          content:
 *              schema:
 *               $ref: "#/definitions/GetTranslations"
 *        '403':
 *          description: User is not an admin
 *        '404':
 *          description: Translations with the specified ID was not found.
 *        '500':
 *          description: Internal Server Error.
 * definitions:
 *  GetTranslations:
 *      type: object
 *      properties:
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
translationRouter
  .route('/:lang/:id')
  .all(tokenAuthentication(), permitChecker([UserRole.Admin]))
  .get(translationController.getTranslationsByWordId);
