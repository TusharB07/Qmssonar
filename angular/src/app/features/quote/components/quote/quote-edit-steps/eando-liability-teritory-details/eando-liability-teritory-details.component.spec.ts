import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityEandOTeritoryDetailsComponent } from './eando-liability-teritory-details.component';

describe('LiabilityTeritoryDetailsComponent', () => {
  let component: LiabilityEandOTeritoryDetailsComponent;
  let fixture: ComponentFixture<LiabilityEandOTeritoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityEandOTeritoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityEandOTeritoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
