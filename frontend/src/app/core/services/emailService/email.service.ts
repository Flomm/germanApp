import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import { ISubscribeRequest } from 'src/app/shared/models/requests/ISubscribeRequest';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private httpClient: HttpClient) {}

  createSubscription(
    subscribeRequest: ISubscribeRequest
  ): Observable<ICustomResponse> {
    return this.httpClient
      .post<ICustomResponse>(
        `${environment.serverUrl}/email/subscribe`,
        subscribeRequest
      )
      .pipe(
        map((response) => {
          return {
            message: response.message,
            isError: false,
          };
        }),
        catchError((httpError) =>
          of({
            message: httpError.error.message,
            isError: true,
          })
        )
      );
  }
}
