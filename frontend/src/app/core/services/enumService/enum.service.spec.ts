import { TestBed } from '@angular/core/testing';
import { EnumService } from './enum.service';

describe('EnumService', () => {
  let service: EnumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('translateTopicType should translate if value exists in enum', () => {
    //Act
    const result: string = service.translateTopicType('FAMILY');

    //Excpect
    expect(result).toEqual('Család');
  });

  it('translateTopicType should return N/A if value exists in enum', () => {
    //Act
    const result: string = service.translateTopicType('test');

    //Excpect
    expect(result).toEqual('N/A');
  });
});
