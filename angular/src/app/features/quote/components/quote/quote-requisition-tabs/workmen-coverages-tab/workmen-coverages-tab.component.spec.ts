import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkmenCoveragesTabComponent } from './workmen-coverages-tab.component';

describe('WorkmenCoveragesTabComponent', () => {
  let component: WorkmenCoveragesTabComponent;
  let fixture: ComponentFixture<WorkmenCoveragesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkmenCoveragesTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkmenCoveragesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
