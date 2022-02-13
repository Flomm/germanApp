import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subscription } from 'rxjs';
import AuthService from 'src/app/core/services/authService/auth.service';
import { MessageService } from 'src/app/core/services/messageService/message.service';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { Language } from '../../models/enums/Language.enum';
import { TopicType } from '../../models/enums/TopicType.enum';
import { UserRole } from '../../models/enums/UserRole.enum';
import IWordRemovalRequest from '../../models/requests/IWordRemovalRequest';
import IFilterFormData from '../../models/viewModels/IFilterFormData.viewModel';
import IGetWordData from '../../models/viewModels/IGetWordData.viewModel';
import IModifyWordDialogData from '../../models/viewModels/IModifyWordDialogData.viewModel';
import { SourceHandler } from './source-handler';

@Component({
  selector: 'app-word-table',
  templateUrl: './word-table.component.html',
  styleUrls: ['./word-table.component.scss'],
})
export class WordTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() reloadTrigger: Observable<void>;

  @Output() wordRemoval: EventEmitter<IWordRemovalRequest> =
    new EventEmitter<IWordRemovalRequest>();
  @Output() wordModify: EventEmitter<IModifyWordDialogData> =
    new EventEmitter<IModifyWordDialogData>();

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  private paginator: MatPaginator;
  private currentFilter: IFilterFormData;
  displayedColumns: string[] = ['word', 'translations'];
  dataSourceHandler: SourceHandler;
  filteringForm: FormGroup;
  languageType = Language;
  currentLanguage: Language = Language.DE;
  topicType = TopicType;
  topicValues: TopicType[];
  totalElements: number;
  reloadSub: Subscription;
  userRoleSub: Subscription;
  userRole: UserRole;

  constructor(
    private authService: AuthService,
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

    if (this.reloadTrigger) {
      this.reloadSub = this.reloadTrigger.subscribe(() => {
        this.loadOnPaging();
      });
    }

    this.userRoleSub = this.authService.userRoleObservable.subscribe((role) => {
      this.userRole = parseInt(role);
      if (this.userRole === UserRole.Admin) {
        this.displayedColumns.push('info');
        this.displayedColumns.push('delete');
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceHandler.loadWordList(this.currentFilter);
    this.paginator.page.subscribe({
      next: () => {
        this.loadOnPaging();
      },
    });
  }

  ngOnDestroy(): void {
    if (this.reloadSub) {
      this.reloadSub.unsubscribe();
    }
    this.userRoleSub.unsubscribe();
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

  submitModify(wordData: IGetWordData): void {
    this.wordModify.emit({
      wordData,
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
    this.dataSourceHandler.loadWordList({
      language: this.currentLanguage,
      pageSize: this.paginator.pageSize,
      pageNumber: this.paginator.pageIndex + 1,
      searchString: this.currentFilter.searchString,
      topics: this.currentFilter.topics,
    });
  }
}
