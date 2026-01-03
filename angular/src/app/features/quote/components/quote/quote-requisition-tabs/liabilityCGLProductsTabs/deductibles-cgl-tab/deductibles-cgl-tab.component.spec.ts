import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductiblesCGLTabComponent } from './deductibles-cgl-tab.component';

describe('DeductiblesCGLTabComponent', () => {
  let component: DeductiblesCGLTabComponent;
  let fixture: ComponentFixture<DeductiblesCGLTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductiblesCGLTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductiblesCGLTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
