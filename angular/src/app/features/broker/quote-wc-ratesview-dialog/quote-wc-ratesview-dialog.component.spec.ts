import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WCRatesFileUploadDialogComponent } from './quote-wc-ratesview-dialog.component';

describe('WCRatesFileUploadDialogComponent', () => {
  let component: WCRatesFileUploadDialogComponent;
  let fixture: ComponentFixture<WCRatesFileUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WCRatesFileUploadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WCRatesFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
