import express from 'express';
import { purchaseController } from '../controllers/purchaseController/purchaseController';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';
import permitChecker from '../middlewares/permitChecker/permitChecker';
import { bodyValidator } from '../middlewares/requestValidator/requestValidator';
import { UserRole } from '../models/models/enums/UserRole.enum';

export const purchaseRoute = express.Router();
purchaseRoute.use(tokenAuthentication());

/**
 * @swagger
 * paths:
 *  /api/purchase:
 *    get:
 *      tags:
 *        - PURCHASE
 *      summary: List purchased tickets of consumer
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: query
 *        name: includePast
 *        description: Add include past property
 *        required: true
 *        schema:
 *          type: boolean
 *      responses:
 *        '200':
 *          description: Successfull listing
 *          content:
 *            schema:
 *              $ref: '#/definitions/GetPurchaseList'
 *        '401':
 *          description: Unauthorized
 *        '403':
 *          description: User is not a consumer
 *        '500':
 *          description: Internal server error
 * definitions:
 *  GetPurchaseList:
 *      type: object
 *      properties:
 *          id:
 *              type: integer
 *          type:
 *              type: integer
 *          name:
 *              type: string
 *          price:
 *              type: integer
 *          date:
 *              type: Date
 *          cityName:
 *              type: string
 *          validationCode:
 *              type: integer
 */
purchaseRoute
  .route('/')
  .all(permitChecker([UserRole.Consumer]))
  .get(purchaseController.getMyPurchases);

/**
 * @swagger
 * paths:
 *  /api/purchase/:
 *    post:
 *      tags:
 *        - PURCHASE
 *      summary: Add a purchase as Consumer
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        description: Add a purchase
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Purchase'
 *      responses:
 *        '201':
 *          description: Purchase was succesfully added
 *        '400':
 *          description: A field is missing
 *        '401':
 *          description: Unauthorized
 *        '403':
 *          description: User is not a consumer
 *        '500':
 *          description: Internal server error
 * definitions:
 *  Purchase:
 *      type: object
 *      properties:
 *          ticketId:
 *              type: integer
 *          count:
 *              type: integer
 */
purchaseRoute
  .route('/')
  .all(permitChecker([UserRole.Consumer]), bodyValidator(['ticketId', 'count']))
  .post(purchaseController.purchase);
