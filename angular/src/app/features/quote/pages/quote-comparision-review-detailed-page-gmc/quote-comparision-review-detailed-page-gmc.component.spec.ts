import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteComparisionReviewDetailedPageGmcComponent } from './quote-comparision-review-detailed-page-gmc.component';

describe('QuoteComparisionReviewDetailedPageGmcComponent', () => {
  let component: QuoteComparisionReviewDetailedPageGmcComponent;
  let fixture: ComponentFixture<QuoteComparisionReviewDetailedPageGmcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteComparisionReviewDetailedPageGmcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteComparisionReviewDetailedPageGmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
