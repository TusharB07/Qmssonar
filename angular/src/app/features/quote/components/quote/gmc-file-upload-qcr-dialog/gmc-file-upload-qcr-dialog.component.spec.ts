import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GMCFileUploadDialogComponent } from './gmc-file-upload-qcr-dialog.component';

describe('GMCFileUploadDialogComponent', () => {
  let component: GMCFileUploadDialogComponent;
  let fixture: ComponentFixture<GMCFileUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GMCFileUploadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GMCFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
