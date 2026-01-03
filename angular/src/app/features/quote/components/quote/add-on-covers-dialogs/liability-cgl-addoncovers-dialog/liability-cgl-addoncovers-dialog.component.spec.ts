import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityCGLAddoncoversDialogComponent } from './liability-cgl-addoncovers-dialog.component';

describe('LiabilityCGLAddoncoversDialogComponent', () => {
  let component: LiabilityCGLAddoncoversDialogComponent;
  let fixture: ComponentFixture<LiabilityCGLAddoncoversDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityCGLAddoncoversDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityCGLAddoncoversDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
