import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityCGLTeritoryDetailsComponent } from './liability-cgl-teritory-details.component';

describe('LiabilityCGLTeritoryDetailsComponent', () => {
  let component: LiabilityCGLTeritoryDetailsComponent;
  let fixture: ComponentFixture<LiabilityCGLTeritoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityCGLTeritoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityCGLTeritoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
