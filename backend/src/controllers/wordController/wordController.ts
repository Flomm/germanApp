import { NextFunction, Request, Response } from 'express';
import { Language } from '../../models/models/Enums/Language.enum';
import IGetWordsResponse from "../../models/responses/IGetWordsResponse";
import { badRequestError } from '../../services/errorCreatorService/errorCreator.service';
import { wordService } from "../../services/wordService/wordService";



export const wordController = {
    getAllUsers(
        req: Request,
        res: Response<IGetWordsResponse>,
        next: NextFunction,
      ) {
        const lang: string = req.params.lang
        console.log(lang)
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
}