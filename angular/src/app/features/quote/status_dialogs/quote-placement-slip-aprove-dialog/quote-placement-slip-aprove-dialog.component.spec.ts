import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePlacementSlipAproveDialogComponent } from './quote-placement-slip-aprove-dialog.component';

describe('QuotePlacementSlipAproveDialogComponent', () => {
  let component: QuotePlacementSlipAproveDialogComponent;
  let fixture: ComponentFixture<QuotePlacementSlipAproveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePlacementSlipAproveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePlacementSlipAproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
