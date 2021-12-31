import IStatisticsDomainModel from '../models/domainModels/IStatisticsDomainModel';

export default interface IGetStatisticsResponse {
  statistics?: IStatisticsDomainModel;
  message?: string;
  isError?: boolean;
}
