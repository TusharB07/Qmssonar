import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAuditTrailDialogComponent } from './quote-audit-trail-dialog.component';

describe('QuoteAuditTrailDialogComponent', () => {
  let component: QuoteAuditTrailDialogComponent;
  let fixture: ComponentFixture<QuoteAuditTrailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteAuditTrailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteAuditTrailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
