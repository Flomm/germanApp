import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import IGetRandomWordRequest from 'src/app/shared/models/requests/IGetRandomWordRequest';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private actualIndex: BehaviorSubject<number> = new BehaviorSubject<number>(
    undefined
  );
  public actualIndexObservable: Observable<number> =
    this.actualIndex.asObservable();

  constructor(private httpClient: HttpClient) {}
  getRandomWords(
    randomWordReq: IGetRandomWordRequest
  ): Observable<IGetWordResponse> {
    return this.httpClient
      .get<IGetWordResponse>(
        `${environment.serverUrl}/game/random-words/${randomWordReq.language}/?quantity=${randomWordReq.quantity}`
      )
      .pipe(
        tap((res) => {
          this.actualIndex.next(1);
        }),
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
