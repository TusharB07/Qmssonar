import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityWorkmenAdOnCoverComponent } from './liability-workmen-addoncovers-dialog.component';

describe('LiabilityProductliabilityAddoncoversDialogComponent', () => {
  let component: LiabilityWorkmenAdOnCoverComponent;
  let fixture: ComponentFixture<LiabilityWorkmenAdOnCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityWorkmenAdOnCoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityWorkmenAdOnCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
