import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineSuminsuredDetailsTabComponent } from './marine-suminsured-details-tab.component';

describe('MarineSuminsuredDetailsTabComponent', () => {
  let component: MarineSuminsuredDetailsTabComponent;
  let fixture: ComponentFixture<MarineSuminsuredDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarineSuminsuredDetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineSuminsuredDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
