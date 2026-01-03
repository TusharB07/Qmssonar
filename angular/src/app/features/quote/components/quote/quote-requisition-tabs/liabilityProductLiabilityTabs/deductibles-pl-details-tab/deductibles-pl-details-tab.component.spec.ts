import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeductiblesEandODetailsTabComponent } from '../../liabilityEandOProductsTabs/deductibles-eando-details-tab/deductibles-eando-details-tab.component';

// import { DeductiblesEandODetailsTabComponent } from './deductibles-pl-details-tab.component';

describe('DeductiblesEandODetailsTabComponent', () => {
  let component: DeductiblesEandODetailsTabComponent;
  let fixture: ComponentFixture<DeductiblesEandODetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductiblesEandODetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductiblesEandODetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
