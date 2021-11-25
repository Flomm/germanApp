import { Component, OnInit } from '@angular/core';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IWordRemovalRequest from 'src/app/shared/models/requests/IWordRemovalRequest';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';

@Component({
  selector: 'app-admin-words',
  templateUrl: './admin-words.component.html',
  styleUrls: ['./admin-words.component.scss']
})
export class AdminWordsComponent implements OnInit {
  getWordResponse: IGetWordResponse;

  constructor(private wordService: WordService) {}

  ngOnInit(): void {
    this.getWordData(Language.DE);
  }

  getWordData(lang: Language): void {
    this.wordService
      .getAllWords(lang)
      .subscribe((response) => (this.getWordResponse = response));
  }

  onLanguageChange(lang: Language) {
    this.getWordData(lang)
  }

  onRemoveWord(removeRequest: IWordRemovalRequest): void {
    this.wordService.removeWord(removeRequest.language, removeRequest.wordId).subscribe((response => {
      console.log(response)
    }))
  }
}
