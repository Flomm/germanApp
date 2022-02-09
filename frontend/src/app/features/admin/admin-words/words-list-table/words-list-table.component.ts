import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Gender } from 'src/app/shared/models/enums/Gender.enum';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { TopicType } from 'src/app/shared/models/enums/TopicType.enum';
import IInitModifyRequest from 'src/app/shared/models/requests/IInitModifyRequest';
import IWordRemovalRequest from 'src/app/shared/models/requests/IWordRemovalRequest';
import { SourceHandler } from 'src/app/shared/components/data-table/source-handler';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { MessageService } from 'src/app/core/services/messageService/message.service';

@Component({
  selector: 'app-words-list-table',
  templateUrl: './words-list-table.component.html',
  styleUrls: ['./words-list-table.component.scss'],
})
export class WordsListTableComponent implements OnInit, AfterViewInit {
  private paginator: MatPaginator;
  displayedColumns: string[] = ['word', 'translations', 'info', 'delete'];
  dataSourceHandler: SourceHandler;
  filteringForm: FormGroup;
  languageType = Language;
  currentLanguage: Language = Language.DE;
  topicType = TopicType;
  topicValues: TopicType[];
  totalElements: number;

  @Output() wordRemoval: EventEmitter<IWordRemovalRequest> =
    new EventEmitter<IWordRemovalRequest>();
  @Output() wordModify: EventEmitter<IInitModifyRequest> =
    new EventEmitter<IInitModifyRequest>();

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  constructor(
    private wordService: WordService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.dataSourceHandler = new SourceHandler(
      this.wordService,
      this.messageService
    );
    this.topicValues = Object.keys(TopicType)
      .filter((key) => {
        if (!isNaN(parseInt(key))) {
          return key;
        }
      })
      .map((key) => parseInt(key));
    this.createForm();
  }

  ngAfterViewInit(): void {
    this.dataSourceHandler.loadWordList(this.currentLanguage, 1, 10, []);
    this.paginator.page.subscribe({
      next: () => {
        this.loadOnPaging();
      },
    });
  }

  createForm(): void {
    this.filteringForm = new FormGroup({
      language: new FormControl(Language.DE, []),
      topic: new FormControl([]),
      filterText: new FormControl(''),
    });
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

  submitSearch(): void {
    this.currentLanguage = this.filteringForm.get('language').value;
    this.dataSourceHandler.loadWordList(
      this.currentLanguage,
      1,
      10,
      this.filteringForm.get('topic').value
    );
  }

  loadOnPaging(): void {
    this.dataSourceHandler.loadWordList(
      this.currentLanguage,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      []
    );
  }
}
