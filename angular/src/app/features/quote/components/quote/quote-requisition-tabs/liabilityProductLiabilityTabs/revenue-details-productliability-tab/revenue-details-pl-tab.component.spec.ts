import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueDetailsProductliabilityTabComponent } from './revenue-details-pl-tab.component';

describe('RevenueDetailsProductliabilityTabComponent', () => {
  let component: RevenueDetailsProductliabilityTabComponent;
  let fixture: ComponentFixture<RevenueDetailsProductliabilityTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueDetailsProductliabilityTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueDetailsProductliabilityTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
