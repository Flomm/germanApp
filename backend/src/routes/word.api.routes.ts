import express from 'express';
import { wordController } from '../controllers/wordController/wordController';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';
import permitChecker from '../middlewares/permitChecker/permitChecker';
import { bodyValidator } from '../middlewares/requestValidator/requestValidator';
import { UserRole } from '../models/models/Enums/UserRole.enum';

export const wordRouter = express.Router();

wordRouter
  .route('/:lang')
  .all(tokenAuthentication(), permitChecker([UserRole.Admin]))
  .get(wordController.getAllWords);

wordRouter
  .route('/:lang/')
  .all(
    tokenAuthentication(),
    permitChecker([UserRole.Admin]),
    bodyValidator(['word', 'translations']),
  )
  .post(wordController.addWord);

wordRouter
  .route('/modify/:lang/:id')
  .all(
    tokenAuthentication(),
    permitChecker([UserRole.Admin]),
    bodyValidator(['word', 'translations']),
  )
  .put(wordController.modifyWord);

wordRouter
  .route('/:lang/:id')
  .all(tokenAuthentication(), permitChecker([UserRole.Admin]))
  .delete(wordController.removeWord);
