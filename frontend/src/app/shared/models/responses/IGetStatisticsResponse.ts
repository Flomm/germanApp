import IStatisticsData from '../models/viewModels/IStatisticsData.viewModel';

export default interface IGetStatisticsResponse {
  statistics?: IStatisticsData;
  message?: string;
  isError?: boolean;
}
