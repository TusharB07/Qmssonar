import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcOtherdetailsTabComponent } from './gmc-otherdetails-tab.component';

describe('GmcOtherdetailsTabComponent', () => {
  let component: GmcOtherdetailsTabComponent;
  let fixture: ComponentFixture<GmcOtherdetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcOtherdetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcOtherdetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
