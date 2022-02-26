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
  transporter: {
    host: 'in-v3.mailjet.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
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
