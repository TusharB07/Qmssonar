import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityEandODeductiblesDetailsComponent } from './liability-cgl-deductibles-details.component';

describe('LiabilityEandODeductiblesDetailsComponent', () => {
  let component: LiabilityEandODeductiblesDetailsComponent;
  let fixture: ComponentFixture<LiabilityEandODeductiblesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityEandODeductiblesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityEandODeductiblesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
