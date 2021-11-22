import express from 'express';
import tokenAuthentication from '../middlewares/jwtAuthenticator/jwtAuthenticator';
import permitChecker from '../middlewares/permitChecker/permitChecker';
import { UserRole } from '../models/models/enums/UserRole.enum';

export const wordRouter = express.Router();

wordRouter
  .route('/:lang')
  .all(tokenAuthentication(), permitChecker([UserRole.Admin]))
  .get();