import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WcCoverageDetailsComponent } from './wc-coverage-details.component';

describe('WcCoverageDetailsComponent', () => {
  let component: WcCoverageDetailsComponent;
  let fixture: ComponentFixture<WcCoverageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WcCoverageDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WcCoverageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
