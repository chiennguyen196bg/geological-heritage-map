import { TestBed, inject } from '@angular/core/testing';

import { HeritageService } from './heritage.service';

describe('HeritageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeritageService]
    });
  });

  it('should be created', inject([HeritageService], (service: HeritageService) => {
    expect(service).toBeTruthy();
  }));
});
