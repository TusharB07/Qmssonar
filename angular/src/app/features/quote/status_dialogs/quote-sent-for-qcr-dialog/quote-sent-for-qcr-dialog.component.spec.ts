import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteSentForQcrDialogComponent } from './quote-sent-for-qcr-dialog.component';

describe('QuoteSentForQcrDialogComponent', () => {
  let component: QuoteSentForQcrDialogComponent;
  let fixture: ComponentFixture<QuoteSentForQcrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteSentForQcrDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteSentForQcrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
