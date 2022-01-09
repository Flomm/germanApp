import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/core/services/gameService/game.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
})
export class InfoComponent implements OnInit {
  @Input() numOfQuestions: number = 0;
  indexSub: Subscription;
  index: number;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.indexSub = this.gameService.actualIndexObservable.subscribe((res) => {
      this.index = res;
    });
  }

  ngOnDestroy(): void {
    this.indexSub.unsubscribe();
  }
}
