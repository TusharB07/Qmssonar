import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTemplateLiabilityComponent } from './sub-template-liability.component';

describe('SubTemplateLiabilityComponent', () => {
  let component: SubTemplateLiabilityComponent;
  let fixture: ComponentFixture<SubTemplateLiabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubTemplateLiabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTemplateLiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
