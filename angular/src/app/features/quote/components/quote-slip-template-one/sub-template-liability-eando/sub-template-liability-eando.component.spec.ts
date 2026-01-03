import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTemplateLiabilityEandOComponent } from './sub-template-liability-eando.component';

describe('SubTemplateLiabilityComponent', () => {
  let component: SubTemplateLiabilityEandOComponent;
  let fixture: ComponentFixture<SubTemplateLiabilityEandOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubTemplateLiabilityEandOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTemplateLiabilityEandOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
