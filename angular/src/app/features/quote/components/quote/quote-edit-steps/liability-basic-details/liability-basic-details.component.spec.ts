import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityBasicDetailsComponent } from './liability-basic-details.component';

describe('LiabilityBasicDetailsComponent', () => {
  let component: LiabilityBasicDetailsComponent;
  let fixture: ComponentFixture<LiabilityBasicDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityBasicDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
