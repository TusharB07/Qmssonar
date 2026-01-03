import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityRevenueDetailsComponent } from './liability-revenue-details.component';

describe('LiabilityRevenueDetailsComponent', () => {
  let component: LiabilityRevenueDetailsComponent;
  let fixture: ComponentFixture<LiabilityRevenueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityRevenueDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityRevenueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
