import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTemplateGmcComponent } from './sub-template-gmc.component';

describe('SubTemplateGmcComponent', () => {
  let component: SubTemplateGmcComponent;
  let fixture: ComponentFixture<SubTemplateGmcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubTemplateGmcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTemplateGmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
