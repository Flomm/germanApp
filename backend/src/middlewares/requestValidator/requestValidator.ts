import { NextFunction, Request, Response } from 'express';
import { RequestPart } from '../../models/models/Enums/RequestPart.enum';
import { badRequestError } from '../../services/errorCreatorService/errorCreatorService';

export const bodyValidator = (values: string[]) =>
  requestValidator(values, RequestPart.BODY);
export const queryValidator = (values: string[]) =>
  requestValidator(values, RequestPart.QUERY);

export function requestValidator(values: string[], examinedPart: RequestPart) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const needToValidate = req[examinedPart];
    const errors: string[] = values.filter(val => {
      return !needToValidate[val];
    });
    if (errors.length) {
      const errorMessages: string = errors
        .map(
          err =>
            `${
              err[0].toUpperCase() + err.substring(1)
            } mező megadása kötelező.`,
        )
        .join(' ');
      return next(badRequestError(errorMessages));
    }
    next();
  };
}
