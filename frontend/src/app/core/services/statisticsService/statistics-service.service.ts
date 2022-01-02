import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StatDataType } from 'src/app/shared/models/enums/StatDataType.enum';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import IGetStatisticsResponse from 'src/app/shared/models/responses/IGetStatisticsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private httpClient: HttpClient) {}

  getMyStatistics(): Observable<IGetStatisticsResponse> {
    return this.httpClient
      .get<IGetStatisticsResponse>(
        `${environment.serverUrl}/statistics/my-statistics/`
      )
      .pipe(
        catchError((httpError) =>
          of({
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }

  incrementStatData(dataType: StatDataType): Observable<ICustomResponse> {
    return this.httpClient
      .patch<ICustomResponse>(`${environment.serverUrl}/statistics/increment`, {
        dataType,
      })
      .pipe(
        map((response) => {
          return {
            message: response.message,
            isError: false,
          };
        }),
        catchError((httpError) =>
          of({
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }
}
