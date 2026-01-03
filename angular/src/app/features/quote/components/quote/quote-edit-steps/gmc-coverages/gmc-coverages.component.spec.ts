import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcCoveragesComponent } from './gmc-coverages.component';

describe('GmcCoveragesComponent', () => {
  let component: GmcCoveragesComponent;
  let fixture: ComponentFixture<GmcCoveragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcCoveragesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcCoveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
