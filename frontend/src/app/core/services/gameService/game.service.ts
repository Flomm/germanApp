import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import ICheckAnswerRequest from 'src/app/shared/models/requests/ICheckAnswerRequest';
import IGetRandomWordRequest from 'src/app/shared/models/requests/IGetRandomWordRequest';
import ICheckAnswerResponse from 'src/app/shared/models/responses/ICheckAnswerResponse';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';
import { environment } from 'src/environments/environment';
import { MessageService } from '../messageService/message.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private actualIndex: BehaviorSubject<number> = new BehaviorSubject<number>(
    undefined
  );
  public actualIndexObservable: Observable<number> =
    this.actualIndex.asObservable();

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  getRandomWords(
    randomWordReq: IGetRandomWordRequest
  ): Observable<IGetWordResponse> {
    return this.httpClient
      .get<IGetWordResponse>(
        `${environment.serverUrl}/game/random-words/${randomWordReq.language}/?quantity=${randomWordReq.quantity}`
      )
      .pipe(
        catchError((httpError) => {
          this.messageService.hideSpinner();
          return of({
            wordList: [],
            message: httpError.error.message ?? 'Hálózati hiba történt.',
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
        catchError((httpError) =>
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
