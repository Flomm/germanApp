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
import { TopicType } from 'src/app/shared/models/enums/TopicType.enum';
import IGetWordData from 'src/app/shared/models/viewModels/IGetWordData.viewModel';
import IInitModifyRequest from 'src/app/shared/models/requests/IInitModifyRequest';
import IWordRemovalRequest from 'src/app/shared/models/requests/IWordRemovalRequest';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';
import { SourceHandler } from 'src/app/shared/components/data-table/source-handler';
import { WordService } from 'src/app/core/services/wordService/word.service';

@Component({
  selector: 'app-words-list-table',
  templateUrl: './words-list-table.component.html',
  styleUrls: ['./words-list-table.component.scss'],
})
export class WordsListTableComponent implements OnInit {
  private paginator: MatPaginator;
  displayedColumns: string[] = ['word', 'info', 'delete'];
  dataSourceHandler: SourceHandler;
  dataSource: MatTableDataSource<IGetWordData>;
  filteringForm: FormGroup;
  languageType = Language;
  currentLanguage: Language = Language.DE;
  topicType = TopicType;
  topicValues: TopicType[];

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

  constructor(private wordService: WordService) {}

  ngOnInit(): void {
    this.dataSourceHandler = new SourceHandler(this.wordService);
    this.dataSourceHandler.loadWordList(this.currentLanguage, 1, []);
    this.dataSource = new MatTableDataSource<IGetWordData>([]);
    this.topicValues = Object.keys(TopicType)
      .filter((key) => {
        if (!isNaN(parseInt(key))) {
          return key;
        }
      })
      .map((key) => parseInt(key));
    this.filteringForm = new FormGroup({
      language: new FormControl(Language.DE, []),
      topic: new FormControl([]),
    });
  }

  ngOnChanges() {
    if (this.getWordResponse) {
      this.dataSource.data = this.getWordResponse.wordList;
    }
  }

  createForm(): void {}

  onLanguageChange(): void {
    this.currentLanguage = this.filteringForm.value.language;
    this.dataSourceHandler.loadWordList(this.currentLanguage, 1, []);
  }

  submitRemoval(wordId: number): void {
    this.wordRemoval.emit({ language: this.currentLanguage, wordId });
  }

  submitModify(
    word: string,
    wordId: number,
    topic: TopicType,
    gender?: Gender
  ): void {
    this.wordModify.emit({
      word,
      wordId,
      topic,
      gender,
      language: this.currentLanguage,
    });
  }
}
