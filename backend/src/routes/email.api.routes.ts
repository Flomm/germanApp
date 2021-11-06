import express from 'express';
import { subscriptionController } from '../controllers/subscribeController/subscribeController';
import { bodyValidator } from '../middlewares/requestValidator/requestValidator';

export const emailRouter = express.Router();

/**
 * @swagger
 * paths:
 *  /api/email/subscribe:
 *      post:
 *          tags:
 *            - SUBSCRIBE
 *          summary: Add a new subscriber
 *          produces:
 *            - application/json
 *          parameters:
 *          - in: body
 *            name: body
 *            description: Creating a new subscription
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Subscriber'
 *          responses:
 *              '201':
 *                  description: Stored successfully
 *              '400':
 *                  description: Missing a field
 *              '409':
 *                  description: Email already exist
 * definitions:
 *  Subscriber:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *          email:
 *              type: string
 */
emailRouter
  .route('/subscribe')
  .all(bodyValidator(['name','email']))
  .post(subscriptionController.createSubscription);
