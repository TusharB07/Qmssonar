import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityCGLBasicDetailsComponent } from './liability-cgl-basic-details.component';

describe('LiabilityCGLBasicDetailsComponent', () => {
  let component: LiabilityCGLBasicDetailsComponent;
  let fixture: ComponentFixture<LiabilityCGLBasicDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityCGLBasicDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityCGLBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
