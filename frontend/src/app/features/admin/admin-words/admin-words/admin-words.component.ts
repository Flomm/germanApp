import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { TranslationService } from 'src/app/core/services/translationService/translation.service';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IModifyWordDialogData from 'src/app/shared/models/models/viewModels/IModifyWordDialogData.viewModel';
import IAddWordRequest from 'src/app/shared/models/requests/IAddWordRequest';
import IInitModifyRequest from 'src/app/shared/models/requests/IInitModifyRequest';
import IWordRemovalRequest from 'src/app/shared/models/requests/IWordRemovalRequest';
import IGetTranslationsResponse from 'src/app/shared/models/responses/IGetTranslationsResponse';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';

@Component({
  selector: 'app-admin-words',
  templateUrl: './admin-words.component.html',
  styleUrls: ['./admin-words.component.scss'],
})
export class AdminWordsComponent implements OnInit {
  getWordResponse: IGetWordResponse;
  language: Language = Language.DE;

  constructor(
    private wordService: WordService,
    private translationService: TranslationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getWordData(Language.DE);
  }

  getWordData(lang: Language): void {
    this.wordService
      .getAllWords(lang)
      .subscribe((response) => (this.getWordResponse = response));
  }

  onLanguageChange(lang: Language): void {
    this.language = lang;
    this.getWordData(lang);
  }

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
            this.dialog.open(DialogComponent, {
              data: {
                isCancelButtonVisible: true,
                cancelButtonText: 'Mégsem',
                okButtonText: 'Mentés',
                dialogText: '',
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
            })
          );
        })
      )
      .subscribe((res) => {
        const panelClass: string = res.isError ? 'warn' : 'success';
        this.snackBar.open(res.message, '', {
          panelClass: [panelClass],
          duration: 3000,
        });
        this.getWordData(getWordRequestForModify.language);
      });
  }

  onRemoveWord(removeRequest: IWordRemovalRequest): void {
    const removalDialogRef: MatDialogRef<DialogComponent> = this.dialog.open(
      DialogComponent,
      {
        data: {
          isCancelButtonVisible: true,
          cancelButtonText: 'Nem',
          okButtonText: 'Igen',
          dialogText: 'Biztosan ki szeretnéd törölni ezt a szót?',
        },
        panelClass: 'default-dialog',
        disableClose: true,
      }
    );

    removalDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.wordService
          .removeWord(removeRequest.language, removeRequest.wordId)
          .subscribe((response) => {
            if (!response.isError) {
              this.onLanguageChange(this.language);
            }
            const panelClass: string = response.isError ? 'warn' : 'success';
            this.snackBar.open(response.message, '', {
              panelClass: [panelClass],
              duration: 3000,
            });
          });
      }
    });
  }
}
