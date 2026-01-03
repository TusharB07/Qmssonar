import { TestBed } from '@angular/core/testing';

import { LiabilityAddonServiceService } from './liability-addon-service.service';

describe('LiabilityAddonServiceService', () => {
  let service: LiabilityAddonServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiabilityAddonServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
