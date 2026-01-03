import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityProductliabilityExclusionDetailsComponent } from './liability-pl-exclusion-details.component';

describe('LiabilityProductliabilityExclusionDetailsComponent', () => {
  let component: LiabilityProductliabilityExclusionDetailsComponent;
  let fixture: ComponentFixture<LiabilityProductliabilityExclusionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityProductliabilityExclusionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityProductliabilityExclusionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
