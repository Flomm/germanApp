import { NextFunction, Response, Request } from 'express';
import { StatDataType } from '../../models/models/Enums/StatDataType.enum';
import ICustomResponse from '../../models/responses/ICustomResponse';
import IGetStatisticsResponse from '../../models/responses/IGetStatisticsResponse';
import { badRequestError } from '../../services/errorCreatorService/errorCreator.service';
import { jwtService } from '../../services/jwtService/jwtService';
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

  incrementStatData(
    req: Request,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ): void {
    const token: string = jwtService.getTokenFromRequest(req)!;
    const userId: string = jwtService.getUserIdFromToken(token).toString();
    const dataType: StatDataType = parseInt(req.body.dataType);
    if (isNaN(dataType) || dataType < 1 || dataType > 4) {
      return next(badRequestError('Érvénytelen adattípus azonosító.'));
    }
    statisticsService
      .incrementStatData(userId, dataType)
      .then(_ => {
        res.status(200).json({ message: 'Adat sikeresen módosítva.' });
      })
      .catch(err => {
        return next(err);
      });
  },
};
