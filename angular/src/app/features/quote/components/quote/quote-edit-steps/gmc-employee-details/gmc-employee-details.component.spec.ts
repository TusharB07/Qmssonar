import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcEmployeeDetailsComponent } from './gmc-employee-details.component';

describe('GmcEmployeeDetailsComponent', () => {
  let component: GmcEmployeeDetailsComponent;
  let fixture: ComponentFixture<GmcEmployeeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcEmployeeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcEmployeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
