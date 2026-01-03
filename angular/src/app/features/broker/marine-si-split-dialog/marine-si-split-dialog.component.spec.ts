import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineSiSplitDialogComponent } from './marine-si-split-dialog.component';

describe('MarineSiSplitDialogComponent', () => {
  let component: MarineSiSplitDialogComponent;
  let fixture: ComponentFixture<MarineSiSplitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarineSiSplitDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineSiSplitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
