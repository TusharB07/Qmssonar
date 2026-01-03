import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchPastQuoteHistoryDialogComponent } from './fetch-past-quote-history-dialog.component';

describe('FetchPastQuoteHistoryDialogComponent', () => {
  let component: FetchPastQuoteHistoryDialogComponent;
  let fixture: ComponentFixture<FetchPastQuoteHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FetchPastQuoteHistoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchPastQuoteHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
