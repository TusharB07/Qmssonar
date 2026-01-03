import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductliabilityExclusionDetailsComponent } from './pl-exclusion-details.component';

describe('LiabilityProductliabilityExclusionDetailsComponent', () => {
  let component: ProductliabilityExclusionDetailsComponent;
  let fixture: ComponentFixture<ProductliabilityExclusionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductliabilityExclusionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductliabilityExclusionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
