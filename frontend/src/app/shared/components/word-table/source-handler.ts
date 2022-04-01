import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageService } from 'src/app/core/services/messageService/message.service';
import { WordService } from 'src/app/core/services/wordService/word.service';
import IFilterFormData from '../../models/viewModels/IFilterFormData.viewModel';
import IGetWordData from '../../models/viewModels/IGetWordData.viewModel';

export class SourceHandler implements DataSource<IGetWordData> {
  totalElements$: Observable<number>;
  isLoading$: Observable<boolean>;

  private wordListSubject: BehaviorSubject<IGetWordData[]> =
    new BehaviorSubject<IGetWordData[]>([]);

  private totalElements: BehaviorSubject<number> = new BehaviorSubject<number>(
    0,
  );

  private _isLoading = true;

  constructor(
    private wordService: WordService,
    private messageService: MessageService,
  ) {
    this.totalElements$ = this.totalElements.asObservable();
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  connect(collectionViewer: CollectionViewer): Observable<IGetWordData[]> {
    return this.wordListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.wordListSubject.complete();
  }

  loadWordList(filterData: IFilterFormData): void {
    this._isLoading = true;
    this.totalElements.next(0);
    this.wordListSubject.next([]);
    this.wordService.getFilteredWords(filterData).subscribe(wordResponse => {
      this._isLoading = false;
      if (wordResponse.isError) {
        this.messageService.openSnackBar(wordResponse.message, '', {
          panelClass: ['warn'],
          duration: 3000,
        });
      } else {
        this.totalElements.next(wordResponse.totalElements);
        this.wordListSubject.next(wordResponse.wordList);
      }
    });
  }
}
