import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDetailsTabComponent } from './basic-details-tab.component';

describe('BasicDetailsTabComponent', () => {
  let component: BasicDetailsTabComponent;
  let fixture: ComponentFixture<BasicDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicDetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
