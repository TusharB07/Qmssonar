import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAnalyticsTabComponent } from './clam-analytics-tab.component';

describe('ClamAnalyticsTabComponent', () => {
  let component: ClaimAnalyticsTabComponent;
  let fixture: ComponentFixture<ClaimAnalyticsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimAnalyticsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimAnalyticsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
