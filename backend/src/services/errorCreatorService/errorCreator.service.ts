import IApiError from '../../models/IApiError';

const generalError =
  (status: number) =>
  (message: string): IApiError => ({
    status,
    message,
  });

export const badRequestError = generalError(400);
export const notFoundError = generalError(404);
export const serverError = generalError(500);
export const unauthorizedError = generalError(401);
export const conflictError = generalError(409);
export const notAcceptableError = generalError(406);
export const forbiddenError = generalError(403);
