import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailGmcComponent } from './payment-detail-gmc.component';

describe('PaymentDetailGmcComponent', () => {
  let component: PaymentDetailGmcComponent;
  let fixture: ComponentFixture<PaymentDetailGmcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDetailGmcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailGmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
