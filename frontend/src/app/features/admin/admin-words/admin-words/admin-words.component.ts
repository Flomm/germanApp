import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/messageService/message.service';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import IModifyWordDialogData from 'src/app/shared/models//viewModels/IModifyWordDialogData.viewModel';
import IAddWordRequest from 'src/app/shared/models/requests/IAddWordRequest';
import IWordRemovalRequest from 'src/app/shared/models/requests/IWordRemovalRequest';

@Component({
  selector: 'app-admin-words',
  templateUrl: './admin-words.component.html',
})
export class AdminWordsComponent {
  reloadEmitter$: Observable<void>;

  private reloadEmitter: Subject<void> = new Subject<void>();

  constructor(
    private wordService: WordService,
    private messageService: MessageService
  ) {
    this.reloadEmitter$ = this.reloadEmitter.asObservable();
  }

  onModifyWord(modifyData: IModifyWordDialogData): void {
    const modifyDialogRef: MatDialogRef<DialogComponent> =
      this.messageService.openDialog({
        data: {
          isCancelButtonVisible: true,
          modifyWordData: modifyData,
        },
        panelClass: 'default-dialog',
        disableClose: true,
      });
    modifyDialogRef
      .afterClosed()
      .pipe(
        switchMap((res: IAddWordRequest) => {
          if (res) {
            return this.wordService.modifyWord(
              modifyData.language,
              modifyData.wordData.id,
              res
            );
          }
          return of({ message: null, isError: null });
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
