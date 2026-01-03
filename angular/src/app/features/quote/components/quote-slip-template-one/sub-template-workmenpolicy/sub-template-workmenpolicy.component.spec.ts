import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTemplateWorkmenpolicyComponent } from './sub-template-workmenpolicy.component';

describe('SubTemplateWorkmenpolicyComponent', () => {
  let component: SubTemplateWorkmenpolicyComponent;
  let fixture: ComponentFixture<SubTemplateWorkmenpolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubTemplateWorkmenpolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTemplateWorkmenpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
