import express from 'express';
import errorHandler from './middlewares/errorHandler/errorHandler';
import apiRouter from './routes/api.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import config from './config';
import swaggerRouter from './routes/swagger.routes';

const app = express();
const swaggerDocs = swaggerJSDoc(config.swaggerOptions);

app.use('/api', apiRouter);
app.use(
  '/swagger',
  swaggerRouter,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs),
);
app.use(errorHandler);

export default app;
