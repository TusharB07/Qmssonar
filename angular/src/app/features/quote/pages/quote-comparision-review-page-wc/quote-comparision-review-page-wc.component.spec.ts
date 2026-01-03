import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteComparisionReviewPageWcComponent } from './quote-comparision-review-page-wc.component';

describe('QuoteComparisionReviewPageWcComponent', () => {
  let component: QuoteComparisionReviewPageWcComponent;
  let fixture: ComponentFixture<QuoteComparisionReviewPageWcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteComparisionReviewPageWcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteComparisionReviewPageWcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
