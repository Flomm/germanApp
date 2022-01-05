import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Gender } from 'src/app/shared/models/enums/Gender.enum';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IGetWordData from 'src/app/shared/models/models/viewModels/IGetWordData.viewModel';
import IInitModifyRequest from 'src/app/shared/models/requests/IInitModifyRequest';
import IWordRemovalRequest from 'src/app/shared/models/requests/IWordRemovalRequest';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';

@Component({
  selector: 'app-words-list-table',
  templateUrl: './words-list-table.component.html',
  styleUrls: ['./words-list-table.component.scss'],
})
export class WordsListTableComponent implements OnInit {
  private paginator: MatPaginator;
  displayedColumns: string[] = ['word', 'info', 'delete'];
  dataSource: MatTableDataSource<IGetWordData>;
  chooseLanguageForm: FormGroup;
  languageType = Language;
  currentLanguage: Language = Language.DE;

  @Input() getWordResponse: IGetWordResponse;

  @Output() wordRequest: EventEmitter<Language> = new EventEmitter<Language>();
  @Output() wordRemoval: EventEmitter<IWordRemovalRequest> =
    new EventEmitter<IWordRemovalRequest>();
  @Output() wordModify: EventEmitter<IInitModifyRequest> =
    new EventEmitter<IInitModifyRequest>();

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IGetWordData>([]);
    this.chooseLanguageForm = new FormGroup({
      language: new FormControl(Language.DE, []),
    });
  }

  ngOnChanges() {
    if (this.getWordResponse) {
      this.dataSource.data = this.getWordResponse.wordList;
    }
  }

  submitWordRequest(): void {
    this.currentLanguage = this.chooseLanguageForm.value.language;
    this.wordRequest.emit(this.currentLanguage);
  }

  submitRemoval(wordId: number): void {
    this.wordRemoval.emit({ language: this.currentLanguage, wordId });
  }

  submitModify(word: string, wordId: number, gender?: Gender): void {
    this.wordModify.emit({
      word,
      wordId,
      gender,
      language: this.currentLanguage,
    });
  }
}
