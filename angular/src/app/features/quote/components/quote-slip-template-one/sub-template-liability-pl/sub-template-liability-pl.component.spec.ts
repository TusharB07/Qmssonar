import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTemplateProductLiabilityCGLComponent } from './sub-template-liability-pl.component';

describe('SubTemplateProductLiabilityCGLComponent', () => {
  let component: SubTemplateProductLiabilityCGLComponent;
  let fixture: ComponentFixture<SubTemplateProductLiabilityCGLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubTemplateProductLiabilityCGLComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTemplateProductLiabilityCGLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
