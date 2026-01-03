import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostContainmentTabComponent } from './cost-containment-tab.component';

describe('CostContainmentTabComponent', () => {
  let component: CostContainmentTabComponent;
  let fixture: ComponentFixture<CostContainmentTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostContainmentTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostContainmentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
