import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConsumerModule } from 'src/app/features/consumer/consumer.module';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import ICheckAnswerRequest from 'src/app/shared/models/requests/ICheckAnswerRequest';
import IGetRandomWordRequest from 'src/app/shared/models/requests/IGetRandomWordRequest';
import ICheckAnswerResponse from 'src/app/shared/models/responses/ICheckAnswerResponse';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: ConsumerModule,
})
export class GameService {
  public actualIndexObservable: Observable<number>;

  private actualIndex: BehaviorSubject<number> = new BehaviorSubject<number>(
    undefined
  );

  constructor(private httpClient: HttpClient) {
    this.actualIndexObservable = this.actualIndex.asObservable();
  }

  getRandomWords(
    randomWordReq: IGetRandomWordRequest
  ): Observable<IGetWordResponse> {
    return this.httpClient
      .post<IGetWordResponse>(
        `${environment.serverUrl}/game/random-words/${randomWordReq.language}/?quantity=${randomWordReq.quantity}`,
        { topics: randomWordReq.topic }
      )
      .pipe(
        catchError((httpError: HttpErrorResponse) => {
          return of({
            wordList: [],
            message: httpError.error.message || 'Hálózati hiba történt.',
            isError: true,
          });
        })
      );
  }

  checkAnswer(
    language: Language,
    checkAnswerReq: ICheckAnswerRequest
  ): Observable<ICheckAnswerResponse> {
    return this.httpClient
      .post<ICheckAnswerResponse>(
        `${environment.serverUrl}/game/check-answer/${language}`,
        checkAnswerReq
      )
      .pipe(
        catchError((httpError: HttpErrorResponse) =>
          of({
            isCorrect: false,
            translations: [],
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }
}
