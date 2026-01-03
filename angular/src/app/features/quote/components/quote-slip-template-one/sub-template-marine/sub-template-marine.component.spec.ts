import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTemplateMarineComponent } from './sub-template-marine.component';

describe('SubTemplateMarineComponent', () => {
  let component: SubTemplateMarineComponent;
  let fixture: ComponentFixture<SubTemplateMarineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubTemplateMarineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTemplateMarineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
