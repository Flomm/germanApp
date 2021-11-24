import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WordService } from './word.service';

describe('WordService', () => {
  let service: WordService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(WordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
