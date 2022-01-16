import { Component, OnInit } from '@angular/core';
import { concatMap, delay } from 'rxjs/operators';
import { GameService } from 'src/app/core/services/gameService/game.service';
import { MessageService } from 'src/app/core/services/messageService/message.service';
import { StatisticsService } from 'src/app/core/services/statisticsService/statistics-service.service';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { StatDataType } from 'src/app/shared/models/enums/StatDataType.enum';
import IAnswer from 'src/app/shared/models/models/viewModels/IAnswer.viewModel';
import IGetWordData from 'src/app/shared/models/models/viewModels/IGetWordData.viewModel';
import ICheckAnswerRequest from 'src/app/shared/models/requests/ICheckAnswerRequest';
import IGetRandomWordRequest from 'src/app/shared/models/requests/IGetRandomWordRequest';
import ICheckAnswerResponse from 'src/app/shared/models/responses/ICheckAnswerResponse';

@Component({
  selector: 'app-consumer-game',
  templateUrl: './consumer-game.component.html',
  styleUrls: ['./consumer-game.component.scss'],
})
export class ConsumerGameComponent implements OnInit {
  isGameOn = false;
  listOfWords: IGetWordData[] = [];
  listOfIncorrectWords: IGetWordData[] = [];
  checkResponse: ICheckAnswerResponse;
  actualIndex: number;
  numOfCorrectAnswers: number = 0;
  errorMessage: string;
  language: Language;

  constructor(
    private gameService: GameService,
    private statisticsService: StatisticsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  onGetRandomWords(randomWordRequestData: IGetRandomWordRequest): void {
    this.messageService.showSpinner();
    this.gameService
      .getRandomWords(randomWordRequestData)
      .pipe(
        concatMap((res) => {
          if (!res.isError) {
            this.actualIndex = 0;
            this.listOfWords = res.wordList;
            this.language = randomWordRequestData.language;
            return this.statisticsService.incrementStatData(StatDataType.SG);
          } else {
            this.errorMessage = res.message;
          }
        })
      )
      .pipe(delay(1500))
      .subscribe((res) => {
        this.messageService.hideSpinner();
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
        concatMap((res) => {
          if (!res.isError) {
            this.checkResponse = res;
            if (res.isCorrect) {
              this.numOfCorrectAnswers++;
              return this.statisticsService.incrementStatData(StatDataType.CA);
            } else {
              this.listOfIncorrectWords.push(
                this.listOfWords[this.actualIndex]
              );
              return this.statisticsService.incrementStatData(StatDataType.IA);
            }
          } else {
            this.errorMessage = res.message;
          }
        })
      )
      .subscribe((res) => {
        if (res.isError) {
          this.isGameOn = false;
          this.errorMessage = res.message;
        }
      });
  }

  goToNextWord(): void {
    if (this.actualIndex < this.listOfWords.length - 1) {
      this.actualIndex++;
    }
  }
}
