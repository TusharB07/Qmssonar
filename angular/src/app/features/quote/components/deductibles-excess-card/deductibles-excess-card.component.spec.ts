import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductiblesExcessCardComponent } from './deductibles-excess-card.component';

describe('DeductiblesExcessCardComponent', () => {
  let component: DeductiblesExcessCardComponent;
  let fixture: ComponentFixture<DeductiblesExcessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductiblesExcessCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductiblesExcessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
