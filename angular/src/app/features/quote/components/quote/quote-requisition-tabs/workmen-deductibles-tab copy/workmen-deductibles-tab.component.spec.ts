import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductiblesWorkmanTabComponent } from './workmen-deductibles-tab.component';

describe('DeductiblesWorkmanTabComponent', () => {
  let component: DeductiblesWorkmanTabComponent;
  let fixture: ComponentFixture<DeductiblesWorkmanTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductiblesWorkmanTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductiblesWorkmanTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
