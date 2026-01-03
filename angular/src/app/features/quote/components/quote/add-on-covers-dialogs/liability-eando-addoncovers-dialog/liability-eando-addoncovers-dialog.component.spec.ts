import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityEandOAddoncoversDialogComponent } from './liability-eando-addoncovers-dialog.component';

describe('LiabilityEandOAddoncoversDialogComponent', () => {
  let component: LiabilityEandOAddoncoversDialogComponent;
  let fixture: ComponentFixture<LiabilityEandOAddoncoversDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityEandOAddoncoversDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityEandOAddoncoversDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
