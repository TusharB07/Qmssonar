import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermAndConditionDialogComponent } from './term-and-condition-dialog.component';

describe('TermAndConditionDialogComponent', () => {
  let component: TermAndConditionDialogComponent;
  let fixture: ComponentFixture<TermAndConditionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermAndConditionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermAndConditionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
