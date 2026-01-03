import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityQuoteOnscreenCompareDialogComponent } from './liability-quote-onscreen-compare-dialog.component';

describe('LiabilityQuoteOnscreenCompareDialogComponent', () => {
  let component: LiabilityQuoteOnscreenCompareDialogComponent;
  let fixture: ComponentFixture<LiabilityQuoteOnscreenCompareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityQuoteOnscreenCompareDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityQuoteOnscreenCompareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
