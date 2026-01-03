import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcFinalRaterComponent } from './gmc-final-rater.component';

describe('GmcFinalRaterComponent', () => {
  let component: GmcFinalRaterComponent;
  let fixture: ComponentFixture<GmcFinalRaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcFinalRaterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcFinalRaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
