import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AdminModule } from 'src/app/features/admin/admin.module';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { TopicType } from 'src/app/shared/models/enums/TopicType.enum';
import IAddWordRequest from 'src/app/shared/models/requests/IAddWordRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  constructor(private httpClient: HttpClient) {}

  getAllWords(lang: Language): Observable<IGetWordResponse> {
    return this.httpClient
      .get<IGetWordResponse>(`${environment.serverUrl}/word/${lang}`)
      .pipe(
        catchError((httpError: HttpErrorResponse) =>
          of({
            wordList: [],
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }

  getFilteredWords(
    lang: Language,
    pageNumber: number,
    topicTypes: TopicType[]
  ): Observable<IGetWordResponse> {
    return this.httpClient
      .post<IGetWordResponse>(
        `${environment.serverUrl}/word/filter/${lang}?pageNumber=${pageNumber}`,
        { topics: topicTypes }
      )
      .pipe(
        catchError((httpError: HttpErrorResponse) =>
          of({
            wordList: [],
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }

  removeWord(lang: Language, wordId: number): Observable<ICustomResponse> {
    return this.httpClient
      .delete<ICustomResponse>(
        `${environment.serverUrl}/word/${lang}/${wordId}`
      )
      .pipe(
        map((response) => {
          return {
            message: response.message,
            isError: false,
          };
        }),
        catchError((httpError: HttpErrorResponse) =>
          of({
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }

  addNewWord(
    lang: Language,
    addWordRequestData: IAddWordRequest
  ): Observable<ICustomResponse> {
    return this.httpClient
      .post<ICustomResponse>(
        `${environment.serverUrl}/word/${lang}`,
        addWordRequestData
      )
      .pipe(
        map((response) => {
          return {
            message: response.message,
            isError: false,
          };
        }),
        catchError((httpError: HttpErrorResponse) =>
          of({
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }

  modifyWord(
    lang: Language,
    wordId: number,
    modifyWordRequestData: IAddWordRequest
  ): Observable<ICustomResponse> {
    return this.httpClient
      .put<ICustomResponse>(
        `${environment.serverUrl}/word/${lang}/${wordId}`,
        modifyWordRequestData
      )
      .pipe(
        map((response) => {
          return {
            message: response.message,
            isError: false,
          };
        }),
        catchError((httpError: HttpErrorResponse) =>
          of({
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }
}
