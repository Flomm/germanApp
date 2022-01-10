import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { GameService } from 'src/app/core/services/gameService/game.service';
import { StatisticsService } from 'src/app/core/services/statisticsService/statistics-service.service';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { StatDataType } from 'src/app/shared/models/enums/StatDataType.enum';
import IAnswer from 'src/app/shared/models/models/viewModels/IAnswer.viewModel';
import IGetWordData from 'src/app/shared/models/models/viewModels/IGetWordData.viewModel';
import IGetRandomWordRequest from 'src/app/shared/models/requests/IGetRandomWordRequest';

@Component({
  selector: 'app-consumer-game',
  templateUrl: './consumer-game.component.html',
  styleUrls: ['./consumer-game.component.scss'],
})
export class ConsumerGameComponent implements OnInit {
  isGameOn = false;
  listOfWords: IGetWordData[] = [];
  actualIndex: number;
  errorMessage: string;
  language: Language;

  constructor(
    private gameService: GameService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {}

  onGetRandomWords(randomWordRequestData: IGetRandomWordRequest): void {
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
      .subscribe((res) => {
        if (res.isError) {
          this.errorMessage = res.message;
        } else {
          this.isGameOn = true;
        }
      });
  }

  onAnswerSubmit(answerList: IAnswer[]): void {
    console.warn('LIST', answerList);
  }

  goToNextWord(): void {
    if (this.actualIndex < this.listOfWords.length - 1) {
      this.actualIndex++;
    }
  }
}
