import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityProductliabilityAddoncoversDialogComponent } from './liability-productliability-addoncovers-dialog.component';

describe('LiabilityProductliabilityAddoncoversDialogComponent', () => {
  let component: LiabilityProductliabilityAddoncoversDialogComponent;
  let fixture: ComponentFixture<LiabilityProductliabilityAddoncoversDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityProductliabilityAddoncoversDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityProductliabilityAddoncoversDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
