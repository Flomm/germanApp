import express from 'express';
import { wordController } from '../controllers/wordController/wordController';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';
import permitChecker from '../middlewares/permitChecker/permitChecker';
import { UserRole } from '../models/models/enums/UserRole.enum';

export const wordRouter = express.Router();

wordRouter
  .route('/:lang')
  .all(tokenAuthentication(), permitChecker([UserRole.Admin]))
  .get(wordController.getAllWords);

wordRouter
.route('/:lang/')
.all(tokenAuthentication(), permitChecker([UserRole.Admin]))
.post()

wordRouter
  .route('/:lang/:id')
  .all(tokenAuthentication(), permitChecker([UserRole.Admin]))
  .delete(wordController.removeWord)