import { NextFunction, Request, Response } from 'express';
import { Language } from '../../models/models/Enums/Language.enum';
import IGetTranslationsResponse from '../../models/responses/IGetTranslationsResponse';
import { badRequestError } from '../../services/errorCreatorService/errorCreator.service';
import { translationService } from '../../services/translationService/translationService';
import idChecker from '../helpers/idChecker/idChecker.helper';
import languageChecker from '../helpers/languageChecker/languageChecker.helper';

export const translationController = {
  getTranslationsByWordId(
    req: Request,
    res: Response<IGetTranslationsResponse>,
    next: NextFunction,
  ): void {
    const lang: string = req.params.lang;
    if (languageChecker(lang as Language)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }
    const wordId: number = parseInt(req.params.id);
    if (!idChecker(wordId)) {
      return next(badRequestError('A szó id pozitív egész szám kell legyen.'));
    }
    translationService
      .getTranslationsByWordId(lang as Language, wordId)
      .then(translations => {
        res.status(200).json({ translationList: translations });
      })
      .catch(err => {
        return next(err);
      });
  },
};
