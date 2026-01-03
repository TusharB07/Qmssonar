import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteComparisionReviewPageLiabilityComponent } from './quote-comparision-review-page-liability.component';

describe('QuoteComparisionReviewPageLiabilityComponent', () => {
  let component: QuoteComparisionReviewPageLiabilityComponent;
  let fixture: ComponentFixture<QuoteComparisionReviewPageLiabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteComparisionReviewPageLiabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteComparisionReviewPageLiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
