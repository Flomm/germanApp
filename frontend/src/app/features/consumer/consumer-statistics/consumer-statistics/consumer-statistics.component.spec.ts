import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { StatisticsService } from 'src/app/core/services/statisticsService/statistics-service.service';
import IGetStatisticsResponse from 'src/app/shared/models/responses/IGetStatisticsResponse';
import { ConsumerStatisticsComponent } from './consumer-statistics.component';

describe('ConsumerStatisticsComponent', () => {
  let component: ConsumerStatisticsComponent;
  let fixture: ComponentFixture<ConsumerStatisticsComponent>;
  let statisticsServiceSpy: jasmine.SpyObj<StatisticsService>;

  beforeEach(async () => {
    statisticsServiceSpy = jasmine.createSpyObj<StatisticsService>(
      'statisticsService',
      ['getMyStatistics'],
    );
    await TestBed.configureTestingModule({
      declarations: [ConsumerStatisticsComponent],
      providers: [
        { provide: StatisticsService, useValue: statisticsServiceSpy },
      ],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerStatisticsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMyStatistics on initialization and make the getStatisticsResponse equal to the response', () => {
    //Arrange
    const mockResponse: IGetStatisticsResponse = {
      message: 'ok',
      isError: true,
    };
    statisticsServiceSpy.getMyStatistics.and.returnValue(of(mockResponse));

    //Act
    fixture.detectChanges();

    //Assert
    expect(statisticsServiceSpy.getMyStatistics).toHaveBeenCalledTimes(1);
    expect(component.getStatisticsResponse).toEqual(mockResponse);
  });
});
