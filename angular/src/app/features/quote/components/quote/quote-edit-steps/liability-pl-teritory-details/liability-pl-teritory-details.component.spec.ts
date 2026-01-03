import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityProductliabilityTeritoryDetailsComponent } from './liability-pl-teritory-details.component';

describe('LiabilityProductliabilityTeritoryDetailsComponent', () => {
  let component: LiabilityProductliabilityTeritoryDetailsComponent;
  let fixture: ComponentFixture<LiabilityProductliabilityTeritoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityProductliabilityTeritoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityProductliabilityTeritoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
