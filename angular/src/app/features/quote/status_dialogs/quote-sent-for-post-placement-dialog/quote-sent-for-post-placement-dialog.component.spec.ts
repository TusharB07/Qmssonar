import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteSentForPostPlacementDialogComponent } from './quote-sent-for-post-placement-dialog.component';

describe('QuoteSentForPostPlacementDialogComponent', () => {
  let component: QuoteSentForPostPlacementDialogComponent;
  let fixture: ComponentFixture<QuoteSentForPostPlacementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteSentForPostPlacementDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteSentForPostPlacementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
