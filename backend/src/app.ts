import express from 'express';
import errorHandler from './middlewares/errorHandler/errorHandler';
import apiRouter from './routes/api.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import config from './config';

const app = express();
const swaggerDocs = swaggerJSDoc(config.swaggerOptions);

app.use('/api', apiRouter);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(errorHandler);

export default app;
