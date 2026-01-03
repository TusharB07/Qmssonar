import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailLiabilityComponent } from './payment-detail-liability.component';

describe('PaymentDetailLiabilityComponent', () => {
  let component: PaymentDetailLiabilityComponent;
  let fixture: ComponentFixture<PaymentDetailLiabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDetailLiabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailLiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
