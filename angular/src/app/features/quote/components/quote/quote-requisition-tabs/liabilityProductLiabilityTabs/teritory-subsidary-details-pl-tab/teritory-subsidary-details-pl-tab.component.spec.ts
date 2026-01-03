import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeritorySubsidaryDetailsProductliabilityTabComponent } from './teritory-subsidary-details-pl-tab.component';

describe('TeritorySubsidaryDetailsProductliabilityTabComponent', () => {
  let component: TeritorySubsidaryDetailsProductliabilityTabComponent;
  let fixture: ComponentFixture<TeritorySubsidaryDetailsProductliabilityTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeritorySubsidaryDetailsProductliabilityTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeritorySubsidaryDetailsProductliabilityTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
