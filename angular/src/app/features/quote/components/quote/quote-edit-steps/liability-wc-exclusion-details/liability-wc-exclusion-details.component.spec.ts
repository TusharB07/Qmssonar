import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityWCExclusionDetailsComponent } from './liability-wc-exclusion-details.component';

describe('LiabilityWCExclusionDetailsComponent', () => {
  let component: LiabilityWCExclusionDetailsComponent;
  let fixture: ComponentFixture<LiabilityWCExclusionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityWCExclusionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityWCExclusionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
