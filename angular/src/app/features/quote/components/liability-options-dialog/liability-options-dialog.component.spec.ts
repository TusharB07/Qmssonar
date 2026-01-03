import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityOptionsDialogComponent } from './liability-options-dialog.component';

describe('LiabilityOptionsDialogComponent', () => {
  let component: LiabilityOptionsDialogComponent;
  let fixture: ComponentFixture<LiabilityOptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityOptionsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
