import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityTurnoverDetailsComponent } from './liability-cgl-claim-experience-turnover-details.component';

describe('LiabilityTurnoverDetailsComponent', () => {
  let component: LiabilityTurnoverDetailsComponent;
  let fixture: ComponentFixture<LiabilityTurnoverDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityTurnoverDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityTurnoverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
