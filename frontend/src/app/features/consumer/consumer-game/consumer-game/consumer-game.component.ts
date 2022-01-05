import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/gameService/game.service';
import IGetRandomWordRequest from 'src/app/shared/models/requests/IGetRandomWordRequest';

@Component({
  selector: 'app-consumer-game',
  templateUrl: './consumer-game.component.html',
  styleUrls: ['./consumer-game.component.scss'],
})
export class ConsumerGameComponent implements OnInit {
  constructor(private gameService: GameService) {}

  ngOnInit(): void {}

  onGetRandomWords(randomWordRequestData: IGetRandomWordRequest): void {
    this.gameService
      .getRandomWords(randomWordRequestData)
      .subscribe((res) => console.warn(res));
  }
}
