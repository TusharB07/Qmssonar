import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonQuoteSlipDialogComponent } from './comparison-quote-slip-dialog.component';

describe('ComparisonQuoteSlipDialogComponent', () => {
  let component: ComparisonQuoteSlipDialogComponent;
  let fixture: ComponentFixture<ComparisonQuoteSlipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparisonQuoteSlipDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonQuoteSlipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
