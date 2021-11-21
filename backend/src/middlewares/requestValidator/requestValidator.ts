import { NextFunction, Request, Response } from 'express';
import { badRequestError } from '../../services/errorCreatorService/errorCreator.service';

export const bodyValidator = (values: string[]) =>
  requestValidator(values, 'body');
export const queryValidator = (values: string[]) =>
  requestValidator(values, 'query');

export default function requestValidator(
  values: string[],
  examinedPart: 'body' | 'query',
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const needToValidate = req[examinedPart];
    let errors: string[] = [];
    for (let value of values) {
      const key = needToValidate[value];
      if (!key) {
        errors.push(value);
      }
    }
    if (errors.length) {
      const errorMessages: string = errors
        .map(err => `${err[0].toUpperCase() + err.substring(1)} mező megadása kötelező.`)
        .join(' ');
      return next(badRequestError(errorMessages));
    }
    next();
  };
}
