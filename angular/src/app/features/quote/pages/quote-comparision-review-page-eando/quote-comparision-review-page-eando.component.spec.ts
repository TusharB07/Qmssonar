import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteComparisionReviewPageLiabilityEandOComponent } from './quote-comparision-review-page-eando.component';

describe('QuoteComparisionReviewPageLiabilityEandOComponent', () => {
  let component: QuoteComparisionReviewPageLiabilityEandOComponent;
  let fixture: ComponentFixture<QuoteComparisionReviewPageLiabilityEandOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteComparisionReviewPageLiabilityEandOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteComparisionReviewPageLiabilityEandOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
