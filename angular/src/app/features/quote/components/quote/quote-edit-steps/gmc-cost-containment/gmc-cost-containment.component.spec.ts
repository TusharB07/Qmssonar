import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcCostContainmentComponent } from './gmc-cost-containment.component';

describe('GmcCostContainmentComponent', () => {
  let component: GmcCostContainmentComponent;
  let fixture: ComponentFixture<GmcCostContainmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcCostContainmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcCostContainmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
