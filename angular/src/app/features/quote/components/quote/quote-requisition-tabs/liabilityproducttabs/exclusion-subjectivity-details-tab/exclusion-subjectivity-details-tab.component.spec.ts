import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusionSubjectivityDetailsTabComponent } from './exclusion-subjectivity-details-tab.component';

describe('ExclusionSubjectivityDetailsTabComponent', () => {
  let component: ExclusionSubjectivityDetailsTabComponent;
  let fixture: ComponentFixture<ExclusionSubjectivityDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExclusionSubjectivityDetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusionSubjectivityDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
