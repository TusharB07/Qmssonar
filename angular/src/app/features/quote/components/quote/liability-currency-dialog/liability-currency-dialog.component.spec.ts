import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityCurrencyDialogComponent } from './liability-currency-dialog.component';

describe('LiabilityCurrencyDialogComponent', () => {
  let component: LiabilityCurrencyDialogComponent;
  let fixture: ComponentFixture<LiabilityCurrencyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityCurrencyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityCurrencyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
