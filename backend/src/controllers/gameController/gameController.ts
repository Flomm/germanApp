import { NextFunction, Request, Response } from 'express';
import { Language } from '../../models/models/Enums/Language.enum';
import { TopicType } from '../../models/models/Enums/TopicType.enum';
import ICheckAnswerRequest from '../../models/requests/ICheckAnswerRequest';
import ICheckAnswerResponse from '../../models/responses/ICheckAnswerResponse';
import IGetWordsResponse from '../../models/responses/IGetWordsResponse';
import { badRequestError } from '../../services/errorCreatorService/errorCreatorService';
import { gameService } from '../../services/gameService/gameService';
import enumArrayValueChecker from '../helpers/enumArrayValueChecker/enumArrayValueChecker.helper';
import enumValueChecker from '../helpers/enumValueChecker/enumValueChecker.helper';

export const gameController = {
  getRandomWords(
    req: Request,
    res: Response<IGetWordsResponse>,
    next: NextFunction,
  ): void {
    const lang: string = req.params.lang;
    if (!enumValueChecker<string>(Language, lang)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }

    const quantity: number = parseInt(req.query.quantity as string);
    if (isNaN(quantity) || quantity < 10 || quantity > 50) {
      return next(badRequestError('Érvénytelen szómennyiség.'));
    }

    const topics: TopicType[] = req.body.topics;
    if (topics?.length > 0) {
      if (!enumArrayValueChecker<number>(TopicType, topics)) {
        return next(badRequestError('Érvénytelen téma azonosító.'));
      }
    }

    gameService
      .getRandomWords(lang as Language, quantity, topics)
      .then(words => {
        res.status(200).json({ wordList: words });
      })
      .catch(err => {
        return next(err);
      });
  },

  checkAnswer(
    req: Request,
    res: Response<ICheckAnswerResponse>,
    next: NextFunction,
  ): void {
    const lang: Language = req.params.lang as Language;
    if (!enumValueChecker<string>(Language, lang)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }
    const answers: ICheckAnswerRequest = req.body;

    gameService
      .checkAnswer(lang, answers)
      .then(answer => {
        res.status(200).send(answer);
      })
      .catch(err => {
        return next(err);
      });
  },
};
