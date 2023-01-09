import dotenv from 'dotenv';

dotenv.config();

export default {
  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  jwt: {
    secretKey: process.env.JWT_SERVICE,
  },
  mailJet: {
    user: process.env.EMAIL_JET_ADDRESS,
    name: process.env.EMAIL_JET_NAME,
    auth: {
      apiKey: process.env.EMAIL_API,
      secretKey: process.env.EMAIL_SECRET,
    },
  },
  bcyrpt: {
    numberOfSaltRounds: 8,
  },
  frontend: {
    frontendUrl: process.env.FE_URL,
  },
  swaggerOptions: {
    apis: ['./src/routes/*.routes.ts'],
    swaggerDefinition: {
      info: {
        title: 'German learning app API',
        version: '1.0.0',
        description: 'German learning app API information',
        contact: {
          name: 'Best Team ever',
        },
      },
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'body',
          description: 'Token from LOGIN API in Bearer TOKEN format',
        },
      },
    },
  },
};
