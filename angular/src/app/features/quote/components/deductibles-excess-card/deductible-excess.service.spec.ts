import { TestBed } from '@angular/core/testing';

import { DeductibleExcessService } from './deductible-excess.service';

describe('DeductibleExcessService', () => {
  let service: DeductibleExcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeductibleExcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
