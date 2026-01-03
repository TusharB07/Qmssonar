import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkmenSummaryTabComponent } from './workmen-summary-tab.component';

describe('WorkmenSummaryTabComponent', () => {
  let component: WorkmenSummaryTabComponent;
  let fixture: ComponentFixture<WorkmenSummaryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkmenSummaryTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkmenSummaryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
