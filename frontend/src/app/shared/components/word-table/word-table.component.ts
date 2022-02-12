import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MessageService } from 'src/app/core/services/messageService/message.service';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { Gender } from '../../models/enums/Gender.enum';
import { Language } from '../../models/enums/Language.enum';
import { TopicType } from '../../models/enums/TopicType.enum';
import IInitModifyRequest from '../../models/requests/IInitModifyRequest';
import IWordRemovalRequest from '../../models/requests/IWordRemovalRequest';
import IFilterFormData from '../../models/viewModels/IFilterFormData.viewModel';
import { SourceHandler } from './source-handler';

@Component({
  selector: 'app-word-table',
  templateUrl: './word-table.component.html',
  styleUrls: ['./word-table.component.scss'],
})
export class WordTableComponent implements OnInit {
  private paginator: MatPaginator;
  displayedColumns: string[] = ['word', 'translations', 'info', 'delete'];
  dataSourceHandler: SourceHandler;
  filteringForm: FormGroup;
  languageType = Language;
  currentLanguage: Language = Language.DE;
  topicType = TopicType;
  topicValues: TopicType[];
  totalElements: number;
  currentFilter: IFilterFormData;

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
    this.currentFilter = {
      language: this.currentLanguage,
      pageNumber: 1,
      pageSize: 10,
      searchString: '',
      topics: [],
    };
  }

  ngAfterViewInit(): void {
    this.dataSourceHandler.loadWordList(this.currentFilter);
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
    this.currentFilter = {
      language: this.currentLanguage,
      pageNumber: 1,
      pageSize: 10,
      searchString: this.filteringForm.get('filterText').value,
      topics: this.filteringForm.get('topic').value,
    };
    this.dataSourceHandler.loadWordList(this.currentFilter);
  }

  loadOnPaging(): void {
    this.dataSourceHandler.loadWordList(this.currentFilter);
  }
}
