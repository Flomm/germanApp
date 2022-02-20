import { TestBed } from '@angular/core/testing';
import { EnumService } from 'src/app/core/services/enumService/enum.service';
import TranslationPipe from './translation.pipe';

describe('TranslationPipe', () => {
  let testPipeClass: TranslationPipe;
  let enumServiceSpy: jasmine.SpyObj<EnumService>;

  beforeEach(() => {
    enumServiceSpy = jasmine.createSpyObj<EnumService>('enumService', [
      'translateTopicType',
    ]);
    TestBed.configureTestingModule({});
    testPipeClass = new TranslationPipe(enumServiceSpy);
  });

  it('should be created', () => {
    expect(testPipeClass).toBeTruthy();
  });

  it(`'s transform method should call the right method of the service if it exists`, () => {
    //Arrange
    const mockServiceMethodName = 'TopicType';

    //Act
    testPipeClass.transform('test', mockServiceMethodName);

    //Assert
    expect(enumServiceSpy.translateTopicType).toHaveBeenCalledOnceWith('test');
  });

  it(`'s transform method should not call the method of the service if it doesn't exist ans should return N/A`, () => {
    //Arrange
    const mockServiceMethodName = 'test';

    //Act
    const result: string = testPipeClass.transform(
      'test',
      mockServiceMethodName
    );

    //Assert
    expect(enumServiceSpy.translateTopicType).not.toHaveBeenCalled();
    expect(result).toEqual('N/A');
  });
});
