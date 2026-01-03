import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityAddoncoversDialogComponent } from './liability-addoncovers-dialog.component';

describe('LiabilityAddoncoversDialogComponent', () => {
  let component: LiabilityAddoncoversDialogComponent;
  let fixture: ComponentFixture<LiabilityAddoncoversDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityAddoncoversDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityAddoncoversDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
