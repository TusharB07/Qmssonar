import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureDiscountDialogeComponent } from './configure-discount-dialoge.component';

describe('ConfigureDiscountDialogeComponent', () => {
  let component: ConfigureDiscountDialogeComponent;
  let fixture: ComponentFixture<ConfigureDiscountDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureDiscountDialogeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureDiscountDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
