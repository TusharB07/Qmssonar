import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoInsurersListComponent } from './co-insurers-list.component';

describe('CoInsurersListComponent', () => {
  let component: CoInsurersListComponent;
  let fixture: ComponentFixture<CoInsurersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoInsurersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoInsurersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
