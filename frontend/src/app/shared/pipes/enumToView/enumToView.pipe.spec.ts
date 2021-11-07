import { TestBed } from '@angular/core/testing';
import IValueName from '../../models/models/viewModels/IValueName.viewModel';
import EnumToViewPipe from './enumToView.pipe';

describe('EnumToViewPipe', () => {
  enum testTicketType {
    Theatre = 1,
    Concert,
    Ballet,
    Cinema,
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
      { value: 1, name: 'Theatre' },
      { value: 2, name: 'Concert' },
      { value: 3, name: 'Ballet' },
      { value: 4, name: 'Cinema' },
    ];

    //Act
    const result: IValueName[] = testPipeClass.transform(testTicketType);

    //Assert
    expect(result).toEqual(expectedObjectArray);
  });
});
