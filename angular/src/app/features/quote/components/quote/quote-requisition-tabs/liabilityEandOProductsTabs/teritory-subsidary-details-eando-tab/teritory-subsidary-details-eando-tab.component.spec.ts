import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeritorySubsidaryDetailsEandOTabComponent } from './teritory-subsidary-details-eando-tab.component';

describe('TeritorySubsidaryDetailsEandOTabComponent', () => {
  let component: TeritorySubsidaryDetailsEandOTabComponent;
  let fixture: ComponentFixture<TeritorySubsidaryDetailsEandOTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeritorySubsidaryDetailsEandOTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeritorySubsidaryDetailsEandOTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
