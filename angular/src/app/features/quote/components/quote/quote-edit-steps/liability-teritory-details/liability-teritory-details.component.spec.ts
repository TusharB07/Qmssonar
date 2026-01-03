import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityTeritoryDetailsComponent } from './liability-teritory-details.component';

describe('LiabilityTeritoryDetailsComponent', () => {
  let component: LiabilityTeritoryDetailsComponent;
  let fixture: ComponentFixture<LiabilityTeritoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiabilityTeritoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityTeritoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
