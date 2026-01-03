import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineCoveragesTabComponent } from './marine-coverages-tab.component';

describe('MarineCoveragesTabComponent', () => {
  let component: MarineCoveragesTabComponent;
  let fixture: ComponentFixture<MarineCoveragesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarineCoveragesTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineCoveragesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
