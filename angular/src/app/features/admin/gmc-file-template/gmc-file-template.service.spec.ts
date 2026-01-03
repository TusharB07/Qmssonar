import { TestBed } from '@angular/core/testing';

import { GmcFileTemplateService } from './gmc-file-template.service';

describe('GmcFileTemplateService', () => {
  let service: GmcFileTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GmcFileTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
