import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasionForQuoteLossComponent } from './reason-for-quote-loss.component';

describe('ReasionForQuoteLossComponent', () => {
  let component: ReasionForQuoteLossComponent;
  let fixture: ComponentFixture<ReasionForQuoteLossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasionForQuoteLossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasionForQuoteLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
