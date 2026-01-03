import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityEandOExclusionDetailsComponent } from './liability-eando-exclusion-details.component';

describe('LiabilityEandOExclusionDetailsComponent', () => {
  let component: LiabilityEandOExclusionDetailsComponent;
  let fixture: ComponentFixture<LiabilityEandOExclusionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityEandOExclusionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityEandOExclusionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
