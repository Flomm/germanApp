import express from 'express';
import { ticketController } from '../controllers/ticketController/ticketController';
import permitChecker from '../middlewares/permitChecker/permitChecker';
import { UserRole } from '../models/models/enums/UserRole.enum';
import { bodyValidator } from '../middlewares/requestValidator/requestValidator';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';

export const ticketRouter = express.Router();
ticketRouter.use(tokenAuthentication());

/**
 * @swagger
 * paths:
 *  /api/ticket/:
 *    get:
 *      tags:
 *        - TICKETS
 *      summary: List tickets as Admin and Consumer
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      responses:
 *        '200':
 *          description: The resource has been fetched and is transmitted in the message body.
 *          content:
 *              schema:
 *               $ref: "#/definitions/Ticket"
 *        '500':
 *          description: Internal Server Error.
 * definitions:
 *  Ticket:
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
 *              type: date
 *          cityName:
 *              type: string
 *          numberOfRemainingTickets:
 *              type: integer
 *          numberOfAllTickets:
 *              type: integer
 */
ticketRouter
  .route('/')
  .all(permitChecker([UserRole.All]))
  .get(ticketController.getTickets);

/**
 * @swagger
 * paths:
 *  /api/ticket/:
 *    post:
 *      tags:
 *        - TICKETS
 *      summary: Add a ticket as Admin
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        description: Add a ticket
 *        required: true
 *        schema:
 *          $ref: '#/definitions/PostTicket'
 *      responses:
 *        '201':
 *          description: Ticket was succesfully added
 *        '400':
 *          description: A field is missing
 *        '403':
 *          description: User is not an admin
 *        '500':
 *          description: Internal server error
 * definitions:
 *  PostTicket:
 *      type: object
 *      properties:
 *          type:
 *              type: integer
 *          name:
 *              type: string
 *          price:
 *              type: integer
 *          date:
 *              type: string
 *              format: date-time
 *          cityName:
 *              type: string
 *          numberOfAllTickets:
 *              type: integer
 */
ticketRouter
  .route('/')
  .all(
    permitChecker([UserRole.Admin]),
    bodyValidator([
      'type',
      'name',
      'price',
      'date',
      'cityName',
      'numberOfAllTickets',
    ]),
  )
  .post(ticketController.addTicket);

/**
 * @swagger
 * paths:
 *  /api/ticket/{ticketId}:
 *    delete:
 *      tags:
 *        - TICKETS
 *      summary: Remove ticket as Admin
 *      security:
 *        - Bearer: []
 *      parameters:
 *        - name: ticketId
 *          in: path
 *          required: true
 *          description: The ID of the ticket.
 *          schema:
 *            type: integer
 *            format: int64
 *            minimum: 1
 *      responses:
 *        '200':
 *          description: Ticket has been removed successfully.
 *        '403':
 *          description: No permission.
 *        '404':
 *          description: Ticket with the specified ID was not found.
 *        '500':
 *          description: Server-side error.
 *        default:
 *          description: Unexpected error.
 */
ticketRouter
  .route('/:id')
  .all(permitChecker([UserRole.Admin]))
  .delete(ticketController.removeTicket);

/**
 * @swagger
 * paths:
 *  /api/ticket/{ticketId}:
 *    put:
 *      tags:
 *        - TICKETS
 *      summary: Update a ticket as Admin
 *      security:
 *        - Bearer: []
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: path
 *        name: ticketId
 *        required: true
 *        schema:
 *          type: integer
 *          minimum: 1
 *        description: ticket ID
 *      - in: body
 *        name: body
 *        description: Add a ticket
 *        required: true
 *        schema:
 *          $ref: '#/definitions/PostTicket'
 *      responses:
 *        '200':
 *          description: Ticket was succesfully updated
 *        '400':
 *          description: A field is missing
 *        '403':
 *          description: User is not an admin
 *        '500':
 *          description: Internal server error
 * definitions:
 *  UpdateTicket:
 *      type: object
 *      properties:
 *          type:
 *              type: integer
 *          name:
 *              type: string
 *          price:
 *              type: integer
 *          date:
 *              type: string
 *              format: date-time
 *          cityName:
 *              type: string
 *          numberOfAllTickets:
 *              type: integer
 */
ticketRouter
  .route('/:ticketId')
  .all(
    permitChecker([UserRole.Admin]),
    bodyValidator([
      'type',
      'name',
      'price',
      'date',
      'cityName',
      'numberOfAllTickets',
    ]),
  )
  .put(ticketController.updateTicket);
