import { TestBed } from '@angular/core/testing';

import { CoInsurersService } from './co-insurers.service';

describe('CoInsurersService', () => {
  let service: CoInsurersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoInsurersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
