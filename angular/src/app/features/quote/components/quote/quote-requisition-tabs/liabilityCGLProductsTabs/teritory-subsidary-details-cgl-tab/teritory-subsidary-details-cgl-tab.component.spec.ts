import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeritorySubsidaryDetailsCGLTabComponent } from './teritory-subsidary-details-cgl-tab.component';

describe('TeritorySubsidaryDetailsCGLTabComponent', () => {
  let component: TeritorySubsidaryDetailsCGLTabComponent;
  let fixture: ComponentFixture<TeritorySubsidaryDetailsCGLTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeritorySubsidaryDetailsCGLTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeritorySubsidaryDetailsCGLTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
