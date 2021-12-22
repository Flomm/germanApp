import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { Language } from 'src/app/shared/models/enums/Language.enum';
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

  onRemoveWord(removeRequest: IWordRemovalRequest): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        isCancelButtonVisible: true,
        cancelButtonText: 'Nem',
        okButtonText: 'Igen',
        dialogText: 'Biztosan ki szeretnéd törölni ezt a szót?',
      },
      panelClass: 'default-dialog',
    });

    dialogRef.afterClosed().subscribe((res) => {
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
