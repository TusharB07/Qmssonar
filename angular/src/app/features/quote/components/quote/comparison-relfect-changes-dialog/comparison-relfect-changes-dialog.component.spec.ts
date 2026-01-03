import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonRelfectChangesDialogComponent } from './comparison-relfect-changes-dialog.component';

describe('ComparisonRelfectChangesDialogComponent', () => {
  let component: ComparisonRelfectChangesDialogComponent;
  let fixture: ComponentFixture<ComparisonRelfectChangesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparisonRelfectChangesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonRelfectChangesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
