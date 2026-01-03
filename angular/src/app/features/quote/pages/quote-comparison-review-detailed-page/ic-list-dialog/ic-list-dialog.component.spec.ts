import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcListDialogComponent } from './ic-list-dialog.component';

describe('IcListDialogComponent', () => {
  let component: IcListDialogComponent;
  let fixture: ComponentFixture<IcListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IcListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
