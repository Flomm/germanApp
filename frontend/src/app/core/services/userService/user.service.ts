import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminModule } from 'src/app/features/admin/admin.module';
import IGetUserResponse from 'src/app/shared/models/responses/IGetUserResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: AdminModule,
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getAllUsers(): Observable<IGetUserResponse> {
    return this.httpClient
      .get<IGetUserResponse>(`${environment.serverUrl}/user/`)
      .pipe(
        catchError((httpError) =>
          of({
            userList: [],
            message: httpError.error.message ?? 'Hálózati hiba történt.',
            isError: true,
          })
        )
      );
  }
}
