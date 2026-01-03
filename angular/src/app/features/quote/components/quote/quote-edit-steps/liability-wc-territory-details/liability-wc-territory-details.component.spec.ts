import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiabilityWCDeductiblesDetailsComponent } from '../liability-wc-deductibles-details/liability-wc-deductibles-details.component';

// import { LiabilityWCDeductiblesDetailsComponent } from './liability-wc-territory-details.component';

describe('LiabilityWCDeductiblesDetailsComponent', () => {
  let component: LiabilityWCDeductiblesDetailsComponent;
  let fixture: ComponentFixture<LiabilityWCDeductiblesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityWCDeductiblesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityWCDeductiblesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
