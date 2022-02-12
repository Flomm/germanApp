import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/messageService/message.service';
import { TranslationService } from 'src/app/core/services/translationService/translation.service';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IModifyWordDialogData from 'src/app/shared/models//viewModels/IModifyWordDialogData.viewModel';
import IAddWordRequest from 'src/app/shared/models/requests/IAddWordRequest';
import IInitModifyRequest from 'src/app/shared/models/requests/IInitModifyRequest';
import IWordRemovalRequest from 'src/app/shared/models/requests/IWordRemovalRequest';
import IGetTranslationsResponse from 'src/app/shared/models/responses/IGetTranslationsResponse';

@Component({
  selector: 'app-admin-words',
  templateUrl: './admin-words.component.html',
})
export class AdminWordsComponent {
  private reloadEmitter: Subject<void> = new Subject<void>();

  reloadEmitter$: Observable<void> = this.reloadEmitter.asObservable();

  constructor(
    private wordService: WordService,
    private translationService: TranslationService,
    private messageService: MessageService
  ) {}

  onModifyWord(getWordRequestForModify: IInitModifyRequest): void {
    this.translationService
      .getTranslationsByWordId(
        getWordRequestForModify.language,
        getWordRequestForModify.wordId
      )
      .pipe(
        switchMap((res: IGetTranslationsResponse) => {
          const modifyWordDialogData: IModifyWordDialogData = {
            initRequest: getWordRequestForModify,
            translationList: res.translationList,
          };
          const modifyDialogRef: MatDialogRef<DialogComponent> =
            this.messageService.openDialog({
              data: {
                isCancelButtonVisible: true,
                modifyWordData: modifyWordDialogData,
              },
              panelClass: 'default-dialog',
              disableClose: true,
            });
          return modifyDialogRef.afterClosed().pipe(
            switchMap((res: IAddWordRequest) => {
              if (res) {
                return this.wordService.modifyWord(
                  getWordRequestForModify.language,
                  getWordRequestForModify.wordId,
                  res
                );
              }
              return of({ message: null, isError: null });
            })
          );
        })
      )
      .subscribe((res) => {
        if (res.message !== null) {
          const panelClass: string = res.isError ? 'warn' : 'success';
          this.messageService.openSnackBar(res.message, '', {
            panelClass: [panelClass],
            duration: 3000,
          });
          if (!res.isError) {
            this.reloadEmitter.next();
          }
        }
      });
  }

  onRemoveWord(removeRequest: IWordRemovalRequest): void {
    const removalDialogRef: MatDialogRef<DialogComponent> =
      this.messageService.openDialog({
        data: {
          isCancelButtonVisible: true,
          cancelButtonText: 'Nem',
          okButtonText: 'Igen',
          dialogText: 'Biztosan ki szeretnéd törölni ezt a szót?',
        },
        panelClass: 'default-dialog',
        disableClose: true,
      });

    removalDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.wordService
          .removeWord(removeRequest.language, removeRequest.wordId)
          .subscribe((response) => {
            if (!response.isError) {
              this.reloadEmitter.next();
            }
            const panelClass: string = response.isError ? 'warn' : 'success';
            this.messageService.openSnackBar(response.message, '', {
              panelClass: [panelClass],
              duration: 3000,
            });
          });
      }
    });
  }
}
