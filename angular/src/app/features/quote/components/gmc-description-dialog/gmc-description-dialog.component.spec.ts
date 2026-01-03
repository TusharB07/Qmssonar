import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcDescriptionDialogComponent } from './gmc-description-dialog.component';

describe('GmcDescriptionDialogComponent', () => {
  let component: GmcDescriptionDialogComponent;
  let fixture: ComponentFixture<GmcDescriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcDescriptionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
