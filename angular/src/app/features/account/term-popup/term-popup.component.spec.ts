import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermPopupComponent } from './term-popup.component';

describe('TermPopupComponent', () => {
  let component: TermPopupComponent;
  let fixture: ComponentFixture<TermPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
