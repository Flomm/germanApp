import { NextFunction, Response, Request } from 'express';
import IGetStatisticsResponse from '../../models/responses/IGetStatisticsResponse';
import { jwtService } from '../../services/jwtService/jwt.service';

export const statisticsController = {
  getMyStatistics(
    req: Request,
    res: Response<IGetStatisticsResponse>,
    next: NextFunction,
  ): void {
    const token: string = jwtService.getTokenFromRequest(req)!;
    const userId: string = jwtService.getUserIdFromToken(token).toString();
    // userService
    //   .getMyData(userId)
    //   .then(userData => res.status(200).json({ userData: userData }))
    //   .catch(err => {
    //     return next(err);
    //   });
  },
};
