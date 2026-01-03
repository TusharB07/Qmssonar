import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineClausesDialogComponent } from './marine-clauses-dialog.component';

describe('MarineClausesDialogComponent', () => {
  let component: MarineClausesDialogComponent;
  let fixture: ComponentFixture<MarineClausesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarineClausesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineClausesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
