import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  constructor(private httpClient: HttpClient) {}

  getAllWords(lang: Language): Observable<IGetWordResponse> {
    return this.httpClient
      .get<IGetWordResponse>(`${environment.serverUrl}/word/${lang}`)
      .pipe(
        catchError((httpError) =>
          of({
            wordList: [],
            message: httpError.error.message ?? 'Connection failure',
            isError: true,
          })
        )
      );
  }

  removeWord(lang: Language, wordId: number): Observable<ICustomResponse> {
    return this.httpClient
      .delete<ICustomResponse>(`${environment.serverUrl}/word/${lang}/${wordId}`)
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
}
