import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineOtherdetailsTabComponent } from './marine-otherdetails-tab.component';

describe('MarineOtherdetailsTabComponent', () => {
  let component: MarineOtherdetailsTabComponent;
  let fixture: ComponentFixture<MarineOtherdetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarineOtherdetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineOtherdetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
