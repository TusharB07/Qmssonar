import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CGLExclusionDetailsComponent } from './cgl-exclusion-details.component';

describe('CGLExclusionDetailsComponent', () => {
  let component: CGLExclusionDetailsComponent;
  let fixture: ComponentFixture<CGLExclusionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CGLExclusionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CGLExclusionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
