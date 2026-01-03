import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcOtherDetailsComponent } from './gmc-other-details.component';

describe('GmcOtherDetailsComponent', () => {
  let component: GmcOtherDetailsComponent;
  let fixture: ComponentFixture<GmcOtherDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcOtherDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
