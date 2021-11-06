import express from 'express';
import cors from 'cors';
import { userRouter } from './user.api.routes';
import { emailRouter } from './email.api.routes';
import { ticketRouter } from './ticket.api.routes';
import { purchaseRoute } from './purchase.routes';

const apiRouter = express.Router();
apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use('/ticket', ticketRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/email', emailRouter);
apiRouter.use('/purchase', purchaseRoute);

export default apiRouter;
