import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/core/services/messageService/message.service';
import { StatisticsService } from 'src/app/core/services/statisticsService/statistics-service.service';
import IGetStatisticsResponse from 'src/app/shared/models/responses/IGetStatisticsResponse';

@Component({
  selector: 'app-consumer-statistics',
  templateUrl: './consumer-statistics.component.html',
})
export class ConsumerStatisticsComponent implements OnInit {
  getStatisticsResponse: IGetStatisticsResponse;

  constructor(
    private statisticsService: StatisticsService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.messageService.showSpinner();
    this.statisticsService
      .getMyStatistics()
      .subscribe((res: IGetStatisticsResponse) => {
        this.getStatisticsResponse = res;
        this.messageService.hideSpinner();
      });
  }
}
