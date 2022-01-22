import { TestBed } from '@angular/core/testing';
import IValueName from '../../models/viewModels/IValueName.viewModel';
import EnumToViewPipe from './enumToView.pipe';

describe('EnumToViewPipe', () => {
  enum testTicketType {
    DER = 'der',
    DIE = 'die',
    DAS = 'das',
  }
  let testPipeClass: EnumToViewPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    testPipeClass = new EnumToViewPipe();
  });

  it('should be created', () => {
    expect(testPipeClass).toBeTruthy();
  });

  it(`'s transform method should return the expected array.`, () => {
    //Arrange
    const expectedObjectArray: IValueName[] = [
      { value: 'der', name: 'DER' },
      { value: 'die', name: 'DIE' },
      { value: 'das', name: 'DAS' },
    ];

    //Act
    const result: IValueName[] = testPipeClass.transform(testTicketType);

    //Assert
    expect(result).toEqual(expectedObjectArray);
  });
});
