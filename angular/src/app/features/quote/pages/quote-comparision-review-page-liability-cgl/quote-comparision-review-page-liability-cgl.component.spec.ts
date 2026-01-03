import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteComparisionReviewPageCGLLiabilityComponent } from './quote-comparision-review-page-liability-cgl.component';

describe('QuoteComparisionReviewPageCGLLiabilityComponent', () => {
  let component: QuoteComparisionReviewPageCGLLiabilityComponent;
  let fixture: ComponentFixture<QuoteComparisionReviewPageCGLLiabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteComparisionReviewPageCGLLiabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteComparisionReviewPageCGLLiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
