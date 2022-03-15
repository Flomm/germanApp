import express from 'express';
import cors from 'cors';
import { userRouter } from './user.api.routes';
import { wordRouter } from './word.api.routes';
import { statisticsRouter } from './statistics.api.routes';
import { gameRouter } from './game.api.routes';
import routeLogger from '../middlewares/routeLogger/routeLogger';

const apiRouter = express.Router();
apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use(routeLogger);
apiRouter.use('/user', userRouter);
apiRouter.use('/word', wordRouter);
apiRouter.use('/statistics', statisticsRouter);
apiRouter.use('/game', gameRouter);

export default apiRouter;
