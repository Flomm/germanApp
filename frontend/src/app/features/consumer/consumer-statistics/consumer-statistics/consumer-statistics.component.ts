import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/core/services/statisticsService/statistics-service.service';
import IGetStatisticsResponse from 'src/app/shared/models/responses/IGetStatisticsResponse';

@Component({
  selector: 'app-consumer-statistics',
  templateUrl: './consumer-statistics.component.html',
  styleUrls: ['./consumer-statistics.component.scss'],
})
export class ConsumerStatisticsComponent implements OnInit {
  getStatisticsResponse: IGetStatisticsResponse;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.statisticsService
      .getMyStatistics()
      .subscribe((res: IGetStatisticsResponse) => {
        this.getStatisticsResponse = res;
      });
  }
}
