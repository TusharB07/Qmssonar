import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoInsurersFormComponent } from './co-insurers-form.component';

describe('CoInsurersFormComponent', () => {
  let component: CoInsurersFormComponent;
  let fixture: ComponentFixture<CoInsurersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoInsurersFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoInsurersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
