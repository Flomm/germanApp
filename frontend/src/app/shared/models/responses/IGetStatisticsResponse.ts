import IStatisticsData from '../viewModels/IStatisticsData.viewModel';

export default interface IGetStatisticsResponse {
  statistics?: IStatisticsData;
  message?: string;
  isError?: boolean;
}
