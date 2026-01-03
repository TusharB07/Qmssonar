import { ComponentFixture, TestBed } from '@angular/core/testing';

import { wcQuoteCoverageExtensionsDialogComponent } from './wc-quote-coverage-extensions-dialog.component';

describe('wcQuoteCoverageExtensionsDialogComponent', () => {
  let component: wcQuoteCoverageExtensionsDialogComponent;
  let fixture: ComponentFixture<wcQuoteCoverageExtensionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ wcQuoteCoverageExtensionsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(wcQuoteCoverageExtensionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
