import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import IGetRandomWordRequest from 'src/app/shared/models/requests/IGetRandomWordRequest';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private httpClient: HttpClient) {}
  getRandomWords(
    randomWordReq: IGetRandomWordRequest
  ): Observable<IGetWordResponse> {
    return this.httpClient
      .get<IGetWordResponse>(
        `${environment.serverUrl}/game/random-words/${randomWordReq.language}/?quantity=${randomWordReq.quantity}`
      )
      .pipe(
        catchError((httpError) =>
          of({
            wordList: [],
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }
}
