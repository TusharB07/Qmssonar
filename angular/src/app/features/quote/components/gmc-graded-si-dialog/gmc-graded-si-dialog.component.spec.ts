import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcGradedSiDialogComponent } from './gmc-graded-si-dialog.component';

describe('GmcGradedSiDialogComponent', () => {
  let component: GmcGradedSiDialogComponent;
  let fixture: ComponentFixture<GmcGradedSiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcGradedSiDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcGradedSiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
