import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslationService } from 'src/app/core/services/translationService/translation.service';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IModifyWordDialogData from 'src/app/shared/models/models/viewModels/IModifyWordDialogData.viewModel';
import IInitModifyRequest from 'src/app/shared/models/requests/IInitModifyRequest';
import IWordRemovalRequest from 'src/app/shared/models/requests/IWordRemovalRequest';
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
      .subscribe((res) => {
        const modifyWordDialogData: IModifyWordDialogData = {
          initRequest: getWordRequestForModify,
          translationList: res.translationList,
        };

        const modifyDialogRef = this.dialog.open(DialogComponent, {
          data: {
            isCancelButtonVisible: true,
            cancelButtonText: 'Mégsem',
            okButtonText: 'Mentés',
            dialogText: 'MODIFY',
            modifyWordData: modifyWordDialogData,
          },
          panelClass: 'default-dialog',
          disableClose: true,
        });

        modifyDialogRef.afterClosed().subscribe((res) => {
          if (res) {
            console.warn('MODIFY');
          }
        });
      });
  }

  onRemoveWord(removeRequest: IWordRemovalRequest): void {
    const removalDialogRef = this.dialog.open(DialogComponent, {
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
