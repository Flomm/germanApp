import express from 'express';

const swaggerRouter = express.Router();

/**
 * @swagger
 * paths:
 *  /swagger/addUserTest:
 *      post:
 *          tags:
 *            - SWAGGER EXAMPLE
 *          summary: Add a new user
 *          consumes:
 *            - application/json
 *            - application/xml
 *          produces:
 *            - application/json
 *            - application/xml
 *          parameters:
 *          - name: userName
 *            description: Name of the user
 *            in: body
 *            required: true
 *            type: string
 *          - name: e-mail
 *            description: E-mail address of the user
 *            in: body
 *            required: true
 *            type: string
 *          responses:
 *              '201':
 *                  description: Created user
 */
swaggerRouter.post('/users', (req, res) => {});

/**
 * @swagger
 * paths:
 *  /swagger/users/{userId}:
 *    get:
 *      tags:
 *        - SWAGGER EXAMPLE
 *      summary: Returns a user by ID
 *      produces:
 *      - application/json
 *      - application/xml
 *      parameters:
 *        - name: userId
 *          in: path
 *          required: true
 *          description: The ID of the user to return.
 *          type: integer
 *          format: int64
 *      responses:
 *        '200':
 *          description: A user object.
 *          content:
 *              schema:
 *               $ref: "#/definitions/UserTest"
 *        '400':
 *          description: The specified user ID is invalid (not a number).
 *        '404':
 *          description: A user with the specified ID was not found.
 *        default:
 *          description: Unexpected error
 * definitions:
 *  UserTest:
 *      type: object
 *      properties:
 *          id:
 *              type: integer
 *              format: int64
 *          username:
 *              type: string
 *          firstName:
 *              type: string
 *          lastName:
 *              type: string
 *          email:
 *              type: string
 *      xml:
 *          name: User
 */
swaggerRouter.get('/users/:userId', (req, res) => {});

/**
 * @swagger
 * paths:
 *  /swagger/users/{userId}:
 *    delete:
 *      tags:
 *        - SWAGGER EXAMPLE
 *      summary: Delete a user by ID
 *      parameters:
 *        - name: userId
 *          in: path
 *          required: true
 *          description: The ID of the user to return.
 *          schema:
 *            type: integer
 *            format: int64
 *            minimum: 1
 *      responses:
 *        '200':
 *          description: The user is deleted.
 *        '400':
 *          description: The specified user ID is invalid (not a number).
 *        '404':
 *          description: A user with the specified ID was not found.
 *        default:
 *          description: Unexpected error.
 */
swaggerRouter.delete('/users/:userId', (req, res) => {});

/**
 * @swagger
 * paths:
 *  /swagger/users/{username}:
 *    put:
 *      tags:
 *        - SWAGGER EXAMPLE
 *      produces:
 *         - application/json
 *         - application/xml
 *      summary: Update user
 *      parameters:
 *        - name: username
 *          in: path
 *          required: true
 *          type: string
 *          description: The name of the user d d
 *        - in: body
 *          name: body
 *          description: Updated user object
 *          required: true
 *          schema:
 *              $ref: "#/definitions/UserTest"
 *      responses:
 *        '400':
 *          description: The specified user ID is invalid (not a number).
 *        '404':
 *          description: A user with the specified ID was not found.
 * definitions:
 *  UserTest:
 *      type: object
 *      properties:
 *          id:
 *              type: integer
 *              format: int64
 *          username:
 *              type: string
 *          firstName:
 *              type: string
 *          lastName:
 *              type: string
 *          email:
 *              type: string
 *      xml:
 *          name: User
 */
swaggerRouter.put('/users/:username', (req, res) => {});

export default swaggerRouter;
