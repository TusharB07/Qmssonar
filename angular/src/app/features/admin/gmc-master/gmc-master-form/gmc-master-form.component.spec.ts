import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcMasterFormComponent } from './gmc-master-form.component';

describe('GmcMasterFormComponent', () => {
  let component: GmcMasterFormComponent;
  let fixture: ComponentFixture<GmcMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcMasterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
