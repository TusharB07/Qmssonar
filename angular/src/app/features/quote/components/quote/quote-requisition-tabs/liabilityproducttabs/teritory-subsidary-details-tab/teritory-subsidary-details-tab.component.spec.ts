import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeritorySubsidaryDetailsTabComponent } from './teritory-subsidary-details-tab.component';

describe('TeritorySubsidaryDetailsTabComponent', () => {
  let component: TeritorySubsidaryDetailsTabComponent;
  let fixture: ComponentFixture<TeritorySubsidaryDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeritorySubsidaryDetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeritorySubsidaryDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
