import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import IGetStatisticsResponse from 'src/app/shared/models/responses/IGetStatisticsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private httpClient: HttpClient) {}

  getMyStatistics(): Observable<IGetStatisticsResponse> {
    return this.httpClient
      .get<IGetStatisticsResponse>(`${environment.serverUrl}/myStatistics/`)
      .pipe(
        catchError((httpError) =>
          of({
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }
}
