import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityProductliabilityTurnoverDetailsComponent } from './liability-pl-turnover-details.component';

describe('LiabilityProductliabilityTurnoverDetailsComponent', () => {
  let component: LiabilityProductliabilityTurnoverDetailsComponent;
  let fixture: ComponentFixture<LiabilityProductliabilityTurnoverDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityProductliabilityTurnoverDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityProductliabilityTurnoverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
