import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { Language } from '../../models/enums/Language.enum';
import { TopicType } from '../../models/enums/TopicType.enum';
import IGetWordData from '../../models/viewModels/IGetWordData.viewModel';

export class SourceHandler implements DataSource<IGetWordData> {
  private wordListSubject: BehaviorSubject<IGetWordData[]> =
    new BehaviorSubject<IGetWordData[]>([]);
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public isLoading$ = this.isLoading.asObservable();

  constructor(private wordService: WordService) {}

  connect(collectionViewer: CollectionViewer): Observable<IGetWordData[]> {
    return this.wordListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.wordListSubject.complete();
    this.isLoading.complete();
  }

  loadWordList(
    lang: Language,
    pageNumber: number,
    topicTypes: TopicType[]
  ): void {
    this.isLoading.next(true);

    this.wordService
      .getFilteredWords(lang, pageNumber, topicTypes)
      .subscribe((wordResponse) => {
        this.wordListSubject.next(wordResponse.wordList);
        this.isLoading.next(false);
      });
  }
}
