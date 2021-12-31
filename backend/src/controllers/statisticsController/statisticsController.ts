import { NextFunction, Response, Request } from 'express';
import IGetStatisticsResponse from '../../models/responses/IGetStatisticsResponse';
import { jwtService } from '../../services/jwtService/jwt.service';
import { statisticsService } from '../../services/statisticsService/statisticsService';

export const statisticsController = {
  getMyStatistics(
    req: Request,
    res: Response<IGetStatisticsResponse>,
    next: NextFunction,
  ): void {
    const token: string = jwtService.getTokenFromRequest(req)!;
    const userId: string = jwtService.getUserIdFromToken(token).toString();
    statisticsService
      .getMyStatistics(userId)
      .then(statData => res.status(200).json({ statistics: statData }))
      .catch(err => {
        return next(err);
      });
  },
};
