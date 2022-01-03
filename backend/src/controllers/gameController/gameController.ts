import { NextFunction, Request, Response } from 'express';
import { Language } from '../../models/models/Enums/Language.enum';
import IGetWordsResponse from '../../models/responses/IGetWordsResponse';
import { badRequestError } from '../../services/errorCreatorService/errorCreator.service';
import { gameService } from '../../services/gameService/gameService';
import languageChecker from '../helpers/languageChecker/languageChecker.helper';

export const gameController = {
  getRandomWords(
    req: Request,
    res: Response<IGetWordsResponse>,
    next: NextFunction,
  ): void {
    const lang: string = req.params.lang;
    if (!languageChecker(lang)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }

    const quantity: number = parseInt(req.query.quantity as string);
    if (isNaN(quantity) || quantity < 10 || quantity > 50) {
      return next(badRequestError('Érvénytelen szómennyiség.'));
    }

    gameService
      .getRandomWords(lang as Language, quantity)
      .then(words => {
        res.status(200).json({ wordList: words });
      })
      .catch(err => {
        return next(err);
      });
  },
};
