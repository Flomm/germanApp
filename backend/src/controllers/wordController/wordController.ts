import { NextFunction, Request, Response } from 'express';
import IAddWordDataModel from '../../models/models/dataModels/IAddWordDataModel';
import { Gender } from '../../models/models/Enums/Gender.enum';
import { Language } from '../../models/models/Enums/Language.enum';
import { TopicType } from '../../models/models/Enums/TopicType.enum';
import ICustomResponse from '../../models/responses/ICustomResponse';
import IGetWordsResponse from '../../models/responses/IGetWordsResponse';
import { badRequestError } from '../../services/errorCreatorService/errorCreator.service';
import { wordService } from '../../services/wordService/wordService';
import enumArrayValueChecker from '../helpers/enumArrayValueChecker/enumArrayValueChecker.helper';
import enumValueChecker from '../helpers/enumValueChecker/enumValueChecker.helper';
import idChecker from '../helpers/idChecker/idChecker.helper';

export const wordController = {
  getAllWords(
    req: Request,
    res: Response<IGetWordsResponse>,
    next: NextFunction,
  ): void {
    const lang: string = req.params.lang;
    if (!enumValueChecker<string>(Language, lang)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }
    wordService
      .getAllWords(lang as Language)
      .then(words => {
        res.status(200).json({ wordList: words });
      })
      .catch(err => {
        return next(err);
      });
  },

  getFilteredWords(
    req: Request,
    res: Response<IGetWordsResponse>,
    next: NextFunction,
  ): void {
    const lang: Language = req.params.lang as Language;
    if (!enumValueChecker<string>(Language, lang)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }

    const topics: TopicType[] = req.body.topics;
    if (topics?.length > 0) {
      if (!enumArrayValueChecker<number>(TopicType, topics)) {
        return next(badRequestError('Érvénytelen téma azonosító.'));
      }
    }

    const pageNumber: number = parseInt(req.query.pageNumber as string);
    if (isNaN(pageNumber) || pageNumber < 1) {
      return next(badRequestError('Érvénytelen oldalszám.'));
    }

    const pageSize: number = parseInt(req.query.pageSize as string);
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 50) {
      return next(badRequestError('Érvénytelen oldalszám.'));
    }

    wordService
      .getFilteredWords(lang, pageNumber, pageSize, topics)
      .then(words => {
        res.status(200).json({ wordList: words });
      })
      .catch(err => {
        return next(err);
      });
  },

  addWord(
    req: Request,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ): void {
    const lang: string = req.params.lang;
    if (!enumValueChecker<string>(Language, lang)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }

    const newWord: IAddWordDataModel = req.body;
    if (newWord.gender) {
      if (!enumValueChecker<string>(Gender, newWord.gender)) {
        return next(badRequestError('Nincs ilyen nem.'));
      }
    }
    if (!enumValueChecker<number>(TopicType, newWord.topic)) {
      return next(badRequestError('Nincs ilyen téma a szótárban.'));
    }

    wordService
      .addNewWord(lang as Language, newWord)
      .then(_ => {
        res.status(201).json({ message: 'Szó sikeresen hozzáadva.' });
      })
      .catch(err => {
        return next(err);
      });
  },

  modifyWord(
    req: Request,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ): void {
    const lang: string = req.params.lang;
    if (!enumValueChecker<string>(Language, lang)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }

    const wordId: number = parseInt(req.params.id);
    if (!idChecker(wordId)) {
      return next(badRequestError('A szó id pozitív egész szám kell legyen.'));
    }

    const modifiedWord: IAddWordDataModel = req.body;
    if (modifiedWord.gender) {
      if (!enumValueChecker<string>(Gender, modifiedWord.gender)) {
        return next(badRequestError('Nincs ilyen nem.'));
      }
    }
    if (!enumValueChecker<number>(TopicType, modifiedWord.topic)) {
      return next(badRequestError('Nincs ilyen téma a szótárban.'));
    }

    wordService
      .modifyWord(lang as Language, modifiedWord, wordId)
      .then(_ => {
        res.status(200).json({ message: 'Szó sikeresen módosítva.' });
      })
      .catch(err => {
        return next(err);
      });
  },

  removeWord(req: Request, res: Response, next: NextFunction): void {
    const lang: string = req.params.lang;
    if (!enumValueChecker<string>(Language, lang)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }
    const wordId: number = parseInt(req.params.id);
    if (!idChecker(wordId)) {
      return next(badRequestError('A szó id pozitív egész szám kell legyen.'));
    }
    wordService
      .removeWord(wordId, lang as Language)
      .then(_ => {
        res.status(200).json({ message: 'A szó sikeresen eltávolítva.' });
      })
      .catch(err => {
        return next(err);
      });
  },
};
