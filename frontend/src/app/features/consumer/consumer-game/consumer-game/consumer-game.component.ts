import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/gameService/game.service';
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
  errorMessage: string;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {}

  onGetRandomWords(randomWordRequestData: IGetRandomWordRequest): void {
    this.gameService.getRandomWords(randomWordRequestData).subscribe((res) => {
      if (!res.isError) {
        this.listOfWords = res.wordList;
        this.isGameOn = true;
      } else {
        this.errorMessage = res.message;
      }
    });
  }
}
