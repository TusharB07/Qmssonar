import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductiblesEandODetailsTabComponent } from './deductibles-eando-details-tab.component';

describe('DeductiblesEandODetailsTabComponent', () => {
  let component: DeductiblesEandODetailsTabComponent;
  let fixture: ComponentFixture<DeductiblesEandODetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductiblesEandODetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductiblesEandODetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
