import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/messageService/message.service';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { Language } from '../../models/enums/Language.enum';
import { TopicType } from '../../models/enums/TopicType.enum';
import IGetWordData from '../../models/viewModels/IGetWordData.viewModel';

export class SourceHandler implements DataSource<IGetWordData> {
  private wordListSubject: BehaviorSubject<IGetWordData[]> =
    new BehaviorSubject<IGetWordData[]>([]);

  constructor(
    private wordService: WordService,
    private messageService: MessageService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<IGetWordData[]> {
    return this.wordListSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.wordListSubject.complete();
  }

  loadWordList(
    lang: Language,
    pageNumber: number,
    topicTypes: TopicType[]
  ): void {
    this.messageService.showSpinner();
    this.wordService
      .getFilteredWords(lang, pageNumber, topicTypes)
      .pipe(delay(200))
      .subscribe((wordResponse) => {
        this.messageService.hideSpinner();
        if (wordResponse.isError) {
          this.messageService.openSnackBar(wordResponse.message, '', {
            panelClass: ['warn'],
            duration: 3000,
          });
        } else {
          this.wordListSubject.next(wordResponse.wordList);
        }
      });
  }
}
