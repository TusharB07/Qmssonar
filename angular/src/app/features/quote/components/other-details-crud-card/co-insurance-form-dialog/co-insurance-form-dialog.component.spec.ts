import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoInsuranceFormDialogComponent } from './co-insurance-form-dialog.component';

describe('CoInsuranceFormDialogComponent', () => {
  let component: CoInsuranceFormDialogComponent;
  let fixture: ComponentFixture<CoInsuranceFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoInsuranceFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoInsuranceFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
