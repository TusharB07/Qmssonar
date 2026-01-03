import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcBasicDetailsComponent } from './gmc-basic-details.component';

describe('GmcBasicDetailsComponent', () => {
  let component: GmcBasicDetailsComponent;
  let fixture: ComponentFixture<GmcBasicDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcBasicDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
