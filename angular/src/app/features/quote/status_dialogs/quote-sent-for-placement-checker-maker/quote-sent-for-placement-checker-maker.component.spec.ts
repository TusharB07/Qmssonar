import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteSentForPlacementCheckerMakerComponent } from './quote-sent-for-placement-checker-maker.component';

describe('QuoteSentForPlacementCheckerMakerComponent', () => {
  let component: QuoteSentForPlacementCheckerMakerComponent;
  let fixture: ComponentFixture<QuoteSentForPlacementCheckerMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteSentForPlacementCheckerMakerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteSentForPlacementCheckerMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
