import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityProductliabilityDeductiblesComponent } from './liability-pl-deductibles-details.component';

describe('LiabilityProductliabilityDeductiblesComponent', () => {
  let component: LiabilityProductliabilityDeductiblesComponent;
  let fixture: ComponentFixture<LiabilityProductliabilityDeductiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityProductliabilityDeductiblesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityProductliabilityDeductiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
