import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import ITicketAddRequest from 'src/app/shared/models/requests/ITicketAddRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import IGetTicketResponse from 'src/app/shared/models/responses/IGetTicketResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export default class TicketService {
  constructor(private httpClient: HttpClient) {}

  addTicket(ticketData: ITicketAddRequest): Observable<ICustomResponse> {
    return this.httpClient
      .post<ICustomResponse>(`${environment.serverUrl}/ticket`, ticketData)
      .pipe(
        map((response) => {
          return {
            message: response.message,
            isError: false,
          };
        }),
        catchError((httpError) =>
          of({
            message: httpError.error.message ?? 'Connection failure',
            isError: true,
          })
        )
      );
  }

  getTicket(): Observable<IGetTicketResponse> {
    return this.httpClient
      .get<IGetTicketResponse>(`${environment.serverUrl}/ticket/`)
      .pipe(
        catchError((httpError) =>
          of({
            ticketList: [],
            message: httpError.error.message ?? 'Connection failure',
            isError: true,
          })
        )
      );
  }

  getMyTickets(): Observable<IGetTicketResponse> {
    return this.httpClient
      .get<IGetTicketResponse>(`${environment.serverUrl}/purchase?includePast=true`)
      .pipe(
        catchError((httpError) =>
          of({
            ticketList: [],
            message: httpError.error.message ?? 'Connection failure',
            isError: true,
          })
        )
      );
  }
}
