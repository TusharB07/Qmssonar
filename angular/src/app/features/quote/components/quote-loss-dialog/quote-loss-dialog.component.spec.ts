import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteLossDialogComponent } from './quote-loss-dialog.component';

describe('QuoteLossDialogComponent', () => {
  let component: QuoteLossDialogComponent;
  let fixture: ComponentFixture<QuoteLossDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteLossDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLossDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
