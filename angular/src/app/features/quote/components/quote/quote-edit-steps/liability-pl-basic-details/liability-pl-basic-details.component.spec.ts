import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityProductliabilityBasicDetailsComponent } from './liability-pl-basic-details.component';

describe('LiabilityProductliabilityBasicDetailsComponent', () => {
  let component: LiabilityProductliabilityBasicDetailsComponent;
  let fixture: ComponentFixture<LiabilityProductliabilityBasicDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityProductliabilityBasicDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityProductliabilityBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
