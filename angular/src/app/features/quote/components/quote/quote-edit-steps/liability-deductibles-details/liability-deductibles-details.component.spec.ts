import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityDeductiblesDetailsComponent } from './liability-deductibles-details.component';

describe('LiabilityDeductiblesDetailsComponent', () => {
  let component: LiabilityDeductiblesDetailsComponent;
  let fixture: ComponentFixture<LiabilityDeductiblesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityDeductiblesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityDeductiblesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
