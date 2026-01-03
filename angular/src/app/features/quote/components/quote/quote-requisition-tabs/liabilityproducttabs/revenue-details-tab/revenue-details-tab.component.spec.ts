import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueDetailsTabComponent } from './revenue-details-tab.component';

describe('RevenueDetailsTabComponent', () => {
  let component: RevenueDetailsTabComponent;
  let fixture: ComponentFixture<RevenueDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueDetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
