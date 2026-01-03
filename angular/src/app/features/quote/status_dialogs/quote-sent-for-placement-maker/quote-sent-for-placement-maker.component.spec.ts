import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteSentForPlacementMakerComponent } from './quote-sent-for-placement-maker.component';

describe('QuoteSentForPlacementMakerComponent', () => {
  let component: QuoteSentForPlacementMakerComponent;
  let fixture: ComponentFixture<QuoteSentForPlacementMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteSentForPlacementMakerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteSentForPlacementMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
