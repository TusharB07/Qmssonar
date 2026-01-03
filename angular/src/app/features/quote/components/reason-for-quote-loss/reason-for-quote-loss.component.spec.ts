import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReasonForQuoteLossComponent } from './reason-for-quote-loss.component';
// angular\src\app\features\quote\components\reason-for-quote-loss\reason-for-quote-loss.component.ts
describe('ReasionForQuoteLossComponent', () => {
  let component: ReasonForQuoteLossComponent;
  let fixture: ComponentFixture<ReasonForQuoteLossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonForQuoteLossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonForQuoteLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
