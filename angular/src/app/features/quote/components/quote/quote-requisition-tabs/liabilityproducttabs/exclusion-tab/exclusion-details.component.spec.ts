import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusionDetailsComponent } from './exclusion-details.component';

describe('LiabilityExclusionDetailsComponent', () => {
  let component: ExclusionDetailsComponent;
  let fixture: ComponentFixture<ExclusionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExclusionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
