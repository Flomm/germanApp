import { NextFunction, Request, Response } from 'express';
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
        if(lang !== 'ger' && lang !== 'hun') {
            return next(badRequestError('Nincs ilyen nyelv a szótárban.'))
        }
        wordService
          .getAllWords(lang)
          .then(words => {
            res.status(200).json({ wordList: words });
          })
          .catch(err => {
            return next(err);
          });
      },
}