import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcGradedSiDialogRmunderwriterviewComponent } from './gmc-graded-si-dialog-rmunderwriterview.component';

describe('GmcGradedSiDialogRmunderwriterviewComponent', () => {
  let component: GmcGradedSiDialogRmunderwriterviewComponent;
  let fixture: ComponentFixture<GmcGradedSiDialogRmunderwriterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcGradedSiDialogRmunderwriterviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcGradedSiDialogRmunderwriterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
