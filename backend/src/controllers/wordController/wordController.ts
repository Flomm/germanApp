import { NextFunction, Request, Response } from 'express';
import IAddWordDataModel from '../../models/models/dataModels/IAddWordDataModel';
import { Language } from '../../models/models/Enums/Language.enum';
import ICustomResponse from '../../models/responses/ICustomResponse';
import IGetWordsResponse from '../../models/responses/IGetWordsResponse';
import { badRequestError } from '../../services/errorCreatorService/errorCreator.service';
import { wordService } from '../../services/wordService/wordService';
import idChecker from '../helpers/idChecker/idChecker.helper';
import languageChecker from '../helpers/languageChecker/languageChecker.helper';

export const wordController = {
  getAllWords(
    req: Request,
    res: Response<IGetWordsResponse>,
    next: NextFunction,
  ): void {
    const lang: string = req.params.lang;
    if (!languageChecker(lang)) {
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

  addWord(
    req: Request,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ): void {
    const lang: string = req.params.lang;
    if (!languageChecker(lang)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }

    const newWord: IAddWordDataModel = req.body;

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
    if (!languageChecker(lang)) {
      return next(badRequestError('Nincs ilyen nyelv a szótárban.'));
    }
    const wordId: number = parseInt(req.params.id);
    if (!idChecker(wordId)) {
      return next(badRequestError('A szó id pozitív egész szám kell legyen.'));
    }
    const modifiedWord: IAddWordDataModel = req.body;

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
    if (!languageChecker(lang)) {
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
