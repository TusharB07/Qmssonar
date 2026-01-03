import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodysReviewDiscountDialogeComponent } from './moodys-review-discount-dialoge.component';

describe('MoodysReviewDiscountDialogeComponent', () => {
  let component: MoodysReviewDiscountDialogeComponent;
  let fixture: ComponentFixture<MoodysReviewDiscountDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoodysReviewDiscountDialogeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoodysReviewDiscountDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
