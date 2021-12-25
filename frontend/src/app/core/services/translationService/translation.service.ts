import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IGetTranslationsResponse from 'src/app/shared/models/responses/IGetTranslationsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private httpClient: HttpClient) {}

  getTranslationsByWordId(
    lang: Language,
    wordId: number
  ): Observable<IGetTranslationsResponse> {
    return this.httpClient
      .get<IGetTranslationsResponse>(
        `${environment.serverUrl}/translation/${lang}/${wordId}`
      )
      .pipe(
        catchError((httpError) =>
          of({
            translationList: [],
            message: httpError.error.message ?? 'Connection failure',
            isError: true,
          })
        )
      );
  }
}