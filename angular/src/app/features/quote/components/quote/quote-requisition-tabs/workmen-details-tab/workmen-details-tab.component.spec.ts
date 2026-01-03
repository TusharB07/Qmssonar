import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkmenDetailsTabComponent } from './workmen-details-tab.component';

describe('WorkmenDetailsTabComponent', () => {
  let component: WorkmenDetailsTabComponent;
  let fixture: ComponentFixture<WorkmenDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkmenDetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkmenDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
