import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryWorkmenTabComponent } from './workmen-territory-tab.component';

describe('TerritoryWorkmenTabComponent', () => {
  let component: TerritoryWorkmenTabComponent;
  let fixture: ComponentFixture<TerritoryWorkmenTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoryWorkmenTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryWorkmenTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
