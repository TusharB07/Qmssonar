import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentTabComponent } from './installment-tab.component';

describe('InstallmentTabComponent', () => {
  let component: InstallmentTabComponent;
  let fixture: ComponentFixture<InstallmentTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallmentTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
