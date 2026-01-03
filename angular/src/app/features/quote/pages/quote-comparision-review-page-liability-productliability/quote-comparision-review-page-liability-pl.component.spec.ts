import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteComparisionReviewPageLiabilityProductliabilityComponent } from './quote-comparision-review-page-liability-pl.component';

describe('QuoteComparisionReviewPageLiabilityProductliabilityComponent', () => {
  let component: QuoteComparisionReviewPageLiabilityProductliabilityComponent;
  let fixture: ComponentFixture<QuoteComparisionReviewPageLiabilityProductliabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteComparisionReviewPageLiabilityProductliabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteComparisionReviewPageLiabilityProductliabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
