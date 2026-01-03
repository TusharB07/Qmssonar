import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineSiDetailsComponent } from './marine-si-details.component';

describe('MarineSiDetailsComponent', () => {
  let component: MarineSiDetailsComponent;
  let fixture: ComponentFixture<MarineSiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarineSiDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineSiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
