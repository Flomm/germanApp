import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConsumerModule } from 'src/app/features/consumer/consumer.module';
import { StatDataType } from 'src/app/shared/models/enums/StatDataType.enum';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import IGetStatisticsResponse from 'src/app/shared/models/responses/IGetStatisticsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: ConsumerModule,
})
export class StatisticsService {
  constructor(private httpClient: HttpClient) {}

  getMyStatistics(): Observable<IGetStatisticsResponse> {
    return this.httpClient
      .get<IGetStatisticsResponse>(
        `${environment.serverUrl}/statistics/my-statistics/`
      )
      .pipe(
        catchError((httpError: HttpErrorResponse) =>
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
        catchError((httpError: HttpErrorResponse) =>
          of({
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }
}
