import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityExclusionDetailsComponent } from './liability-exclusion-details.component';

describe('LiabilityExclusionDetailsComponent', () => {
  let component: LiabilityExclusionDetailsComponent;
  let fixture: ComponentFixture<LiabilityExclusionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityExclusionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityExclusionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
