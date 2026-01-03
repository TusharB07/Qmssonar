import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteGmcEmployeeviewDialogComponent } from './quote-gmc-employeeview-dialog.component';

describe('QuoteGmcEmployeeviewDialogComponent', () => {
  let component: QuoteGmcEmployeeviewDialogComponent;
  let fixture: ComponentFixture<QuoteGmcEmployeeviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteGmcEmployeeviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteGmcEmployeeviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
