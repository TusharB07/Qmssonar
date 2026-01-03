import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoInsuranceFormDialogGmcComponent } from './co-insurance-form-dialog-gmc.component';

describe('CoInsuranceFormDialogGmcComponent', () => {
  let component: CoInsuranceFormDialogGmcComponent;
  let fixture: ComponentFixture<CoInsuranceFormDialogGmcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoInsuranceFormDialogGmcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoInsuranceFormDialogGmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
