import express from 'express';
import cors from 'cors';
import { userRouter } from './user.api.routes';
import { wordRouter } from './word.api.routes';

const apiRouter = express.Router();
apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use('/user', userRouter);
apiRouter.use('/word', wordRouter);

export default apiRouter;
