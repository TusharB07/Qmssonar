import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcQuoteOnscreenCompareDialogComponent } from './gmc-quote-onscreen-compare-dialog.component';

describe('GmcQuoteOnscreenCompareDialogComponent', () => {
  let component: GmcQuoteOnscreenCompareDialogComponent;
  let fixture: ComponentFixture<GmcQuoteOnscreenCompareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcQuoteOnscreenCompareDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcQuoteOnscreenCompareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
