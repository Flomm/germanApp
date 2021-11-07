import ITicketData from "../models/viewModels/ITicketData.viewModel";

export default interface IGetTicketResponse {
  ticketList: ITicketData[];
  message?: string;
  isError?: boolean;
}
