import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityEandOBasicDetailsComponent } from './eando-liability-basic-details.component';

describe('LiabilityEandOBasicDetailsComponent', () => {
  let component: LiabilityEandOBasicDetailsComponent;
  let fixture: ComponentFixture<LiabilityEandOBasicDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityEandOBasicDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityEandOBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
