import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcClaimAnalyticsComponent } from './gmc-claim-analytics.component';

describe('GmcClaimAnalyticsComponent', () => {
  let component: GmcClaimAnalyticsComponent;
  let fixture: ComponentFixture<GmcClaimAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcClaimAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcClaimAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
