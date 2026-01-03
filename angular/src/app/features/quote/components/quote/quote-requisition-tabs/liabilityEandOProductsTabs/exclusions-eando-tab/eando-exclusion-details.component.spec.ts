import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EandOExclusionDetailsComponent } from './eando-exclusion-details.component';

describe('LiabilityEandOExclusionDetailsComponent', () => {
  let component: EandOExclusionDetailsComponent;
  let fixture: ComponentFixture<EandOExclusionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EandOExclusionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EandOExclusionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
