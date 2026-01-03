import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineCoveragesClausesComponent } from './marine-coverages-clauses.component';

describe('MarineCoveragesClausesComponent', () => {
  let component: MarineCoveragesClausesComponent;
  let fixture: ComponentFixture<MarineCoveragesClausesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarineCoveragesClausesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineCoveragesClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
