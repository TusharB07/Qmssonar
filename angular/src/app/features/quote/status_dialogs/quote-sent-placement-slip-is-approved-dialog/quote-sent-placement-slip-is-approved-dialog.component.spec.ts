import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteSentPlacementSlipIsApprovedDialogComponent } from './quote-sent-placement-slip-is-approved-dialog.component';

describe('QuoteSentPlacementSlipIsApprovedDialogComponent', () => {
  let component: QuoteSentPlacementSlipIsApprovedDialogComponent;
  let fixture: ComponentFixture<QuoteSentPlacementSlipIsApprovedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteSentPlacementSlipIsApprovedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteSentPlacementSlipIsApprovedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
