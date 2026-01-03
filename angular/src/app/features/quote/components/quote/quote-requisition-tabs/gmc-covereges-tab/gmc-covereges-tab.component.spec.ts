import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcCoveregesTabComponent } from './gmc-covereges-tab.component';

describe('GmcCoveregesTabComponent', () => {
  let component: GmcCoveregesTabComponent;
  let fixture: ComponentFixture<GmcCoveregesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcCoveregesTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcCoveregesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
