import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductiblesDetailsTabComponent } from './deductibles-details-tab.component';

describe('DeductiblesDetailsTabComponent', () => {
  let component: DeductiblesDetailsTabComponent;
  let fixture: ComponentFixture<DeductiblesDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductiblesDetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductiblesDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
