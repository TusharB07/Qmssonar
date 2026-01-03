import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardAddonsTabComponent } from './standard-addons-tab.component';

describe('StandardAddonsTabComponent', () => {
  let component: StandardAddonsTabComponent;
  let fixture: ComponentFixture<StandardAddonsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardAddonsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardAddonsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
