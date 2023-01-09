import { Component } from '@angular/core';
import { of } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { GameService } from 'src/app/core/services/gameService/game.service';
import { MessageService } from 'src/app/core/services/messageService/message.service';
import { StatisticsService } from 'src/app/core/services/statisticsService/statistics-service.service';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { StatDataType } from 'src/app/shared/models/enums/StatDataType.enum';
import IAnswer from 'src/app/shared/models/viewModels/IAnswer.viewModel';
import IGetWordData from 'src/app/shared/models/viewModels/IGetWordData.viewModel';
import ICheckAnswerRequest from 'src/app/shared/models/requests/ICheckAnswerRequest';
import IGetRandomWordRequest from 'src/app/shared/models/requests/IGetRandomWordRequest';
import ICheckAnswerResponse from 'src/app/shared/models/responses/ICheckAnswerResponse';

@Component({
  selector: 'app-consumer-game',
  templateUrl: './consumer-game.component.html',
  styleUrls: ['./consumer-game.component.scss'],
})
export class ConsumerGameComponent {
  isGameOn = false;
  isGameFinished: boolean;
  listOfWords: IGetWordData[] = [];
  listOfIncorrectWords: IGetWordData[] = [];
  checkResponse: ICheckAnswerResponse;
  actualIndex: number;
  numOfCorrectAnswers = 0;
  errorMessage: string;
  language: Language;

  constructor(
    private gameService: GameService,
    private statisticsService: StatisticsService,
    private messageService: MessageService,
  ) {}

  onGameStart(randomWordRequestData: IGetRandomWordRequest): void {
    this.messageService.showSpinner();
    this.gameService
      .getRandomWords(randomWordRequestData)
      .pipe(
        concatMap(res => {
          if (!res.isError) {
            this.actualIndex = 0;
            this.listOfWords = res.wordList;
            this.language = randomWordRequestData.language;
            return this.statisticsService.incrementStatData(StatDataType.SG);
          } else {
            return of(res);
          }
        }),
        finalize(() => {
          this.messageService.hideSpinner();
        }),
      )
      .subscribe(res => {
        if (res.isError) {
          this.errorMessage = res.message;
        } else {
          this.isGameOn = true;
        }
      });
  }

  onAnswerSubmit(answerList: IAnswer[]): void {
    const checkRequest: ICheckAnswerRequest = {
      wordId: this.listOfWords[this.actualIndex].id,
      answerList,
    };
    this.gameService
      .checkAnswer(this.language, checkRequest)
      .pipe(
        concatMap(res => {
          if (!res.isError) {
            const actualWord: IGetWordData = this.listOfWords[this.actualIndex];
            this.checkResponse = res;
            if (res.isCorrect) {
              if (
                this.isInIncorrectList(actualWord) &&
                this.listOfWords.length > 1
              ) {
                this.removeWordFromIncorrectList(actualWord);
              }
              this.numOfCorrectAnswers++;
              return this.statisticsService.incrementStatData(StatDataType.CA);
            } else {
              if (!this.isInIncorrectList(actualWord)) {
                this.listOfIncorrectWords.push(actualWord);
              }
              return this.statisticsService.incrementStatData(StatDataType.IA);
            }
          } else {
            return of(res);
          }
        }),
      )
      .subscribe(res => {
        if (res.isError) {
          this.isGameOn = false;
          this.errorMessage = res.message;
        }
      });
  }

  goToNextWord(): void {
    if (this.actualIndex < this.listOfWords.length - 1) {
      this.actualIndex++;
    } else if (this.actualIndex === this.listOfWords.length - 1) {
      this.isGameFinished = true;
    }
  }

  isInIncorrectList(word: IGetWordData): boolean {
    return this.listOfIncorrectWords.includes(word);
  }

  removeWordFromIncorrectList(word: IGetWordData): void {
    this.listOfIncorrectWords.splice(
      this.listOfIncorrectWords.indexOf(word),
      1,
    );
  }

  resetSelf(): void {
    this.isGameOn = false;
    this.isGameFinished = false;
    this.listOfWords = [];
    this.listOfIncorrectWords = [];
    this.checkResponse = null;
    this.actualIndex = null;
    this.numOfCorrectAnswers = 0;
    this.errorMessage = null;
  }

  replayWithIncorrect(): void {
    this.isGameFinished = false;
    this.listOfWords = this.listOfIncorrectWords;
    this.listOfIncorrectWords = [];
    this.actualIndex = 0;
    this.numOfCorrectAnswers = 0;
  }

  handleEndDecision(isReset: boolean): void {
    if (isReset) {
      this.statisticsService.incrementStatData(StatDataType.FG).subscribe(_ => {
        this.resetSelf();
      });
    } else {
      this.replayWithIncorrect();
    }
  }

  backToMenu(): void {
    this.resetSelf();
  }
}
