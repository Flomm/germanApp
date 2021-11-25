import { NextFunction, Request, Response } from 'express';
import { Language } from '../../models/models/Enums/Language.enum';
import IGetWordsResponse from "../../models/responses/IGetWordsResponse";
import { badRequestError } from '../../services/errorCreatorService/errorCreator.service';
import { wordService } from "../../services/wordService/wordService";



export const wordController = {
    getAllWords(
        req: Request,
        res: Response<IGetWordsResponse>,
        next: NextFunction,
      ) {
        const lang: string = req.params.lang
        if(!(<any>Object).values(Language).includes(lang)) {
            return next(badRequestError('Nincs ilyen nyelv a szótárban.'))
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

    removeWord(
      req: Request,
      res: Response,
      next: NextFunction,
    ){
      const lang: string = req.params.lang
      if(!(<any>Object).values(Language).includes(lang)) {
          return next(badRequestError('Nincs ilyen nyelv a szótárban.'))
      }
      const wordId: number = parseInt(req.params.id);
      if (isNaN(wordId) || wordId < 1) {
        return next(badRequestError('A szó id pozitív egész szám kell legyen.'));
      }
      wordService
      .removeWord(wordId, lang as Language)
      .then(_ => {
        res
          .status(200)
          .json({ message: 'A szó sikeresen eltávolítva.' });
      })
      .catch(err => {
        next(err);
        return;
      });

    }
}