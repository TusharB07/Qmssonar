import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityCGLExclusionDetailsComponent } from './liability-cgl-exclusion-details.component';

describe('LiabilityCGLExclusionDetailsComponent', () => {
  let component: LiabilityCGLExclusionDetailsComponent;
  let fixture: ComponentFixture<LiabilityCGLExclusionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityCGLExclusionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityCGLExclusionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
