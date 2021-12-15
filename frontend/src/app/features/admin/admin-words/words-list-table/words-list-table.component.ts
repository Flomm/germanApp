import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IGetWordData from 'src/app/shared/models/models/viewModels/IGetWordData.viewModel';
import IWordRemovalRequest from 'src/app/shared/models/requests/IWordRemovalRequest';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';

@Component({
  selector: 'app-words-list-table',
  templateUrl: './words-list-table.component.html',
  styleUrls: ['./words-list-table.component.scss']
})
export class WordsListTableComponent implements OnInit {
  private paginator: MatPaginator;
  displayedColumns: string[] = ['word', 'info', 'delete'];
  dataSource: MatTableDataSource<IGetWordData>;
  chooseLanguageForm: FormGroup
  languageList: object[] = [{name: 'német', value: Language.DE},{name: 'magyar', value: Language.HU}]
  currentLanguage: Language = Language.DE

  @Input() getWordResponse: IGetWordResponse;

  @Output() wordRequest: EventEmitter<Language> = new EventEmitter<Language>()
  @Output() wordRemoval: EventEmitter<IWordRemovalRequest> = new EventEmitter<IWordRemovalRequest>()

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IGetWordData>([]);
    this.chooseLanguageForm = new FormGroup({
      language: new FormControl('német', [])
    })
  }

  ngOnChanges() {
    if (this.getWordResponse) {
      this.dataSource = new MatTableDataSource<IGetWordData>(
        this.getWordResponse.wordList
      );
    }
  }

  submitWordRequest(): void {
    this.currentLanguage = this.chooseLanguageForm.value.language
    this.wordRequest.emit(this.currentLanguage)
  }

  submitRemoval(wordId: number): void {
    this.wordRemoval.emit({language: this.currentLanguage, wordId: wordId})
  }
}  