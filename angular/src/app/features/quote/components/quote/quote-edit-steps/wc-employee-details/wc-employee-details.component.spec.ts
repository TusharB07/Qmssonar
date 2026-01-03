import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WcEmployeeDetailsComponent } from './wc-employee-details.component';

describe('WcEmployeeDetailsComponent', () => {
  let component: WcEmployeeDetailsComponent;
  let fixture: ComponentFixture<WcEmployeeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WcEmployeeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WcEmployeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
