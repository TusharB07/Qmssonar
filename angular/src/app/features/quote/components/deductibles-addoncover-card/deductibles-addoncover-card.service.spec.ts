import { TestBed } from '@angular/core/testing';

import { DeductiblesAddoncoverCardService } from './deductibles-addoncover-card.service';

describe('DeductiblesAddoncoverCardService', () => {
  let service: DeductiblesAddoncoverCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeductiblesAddoncoverCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
