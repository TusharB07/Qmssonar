import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDetailsProductliabilityTabComponent } from './basic-details-pl-tab.component';

describe('BasicDetailsProductliabilityTabComponent', () => {
  let component: BasicDetailsProductliabilityTabComponent;
  let fixture: ComponentFixture<BasicDetailsProductliabilityTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicDetailsProductliabilityTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDetailsProductliabilityTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
