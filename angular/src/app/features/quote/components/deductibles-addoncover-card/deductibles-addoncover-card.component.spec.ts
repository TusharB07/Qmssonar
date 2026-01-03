import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductiblesAddoncoverCardComponent } from './deductibles-addoncover-card.component';

describe('DeductiblesAddoncoverCardComponent', () => {
  let component: DeductiblesAddoncoverCardComponent;
  let fixture: ComponentFixture<DeductiblesAddoncoverCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductiblesAddoncoverCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductiblesAddoncoverCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
