import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcMaternityBenifitsComponent } from './gmc-maternity-benifits.component';

describe('GmcMaternityBenifitsComponent', () => {
  let component: GmcMaternityBenifitsComponent;
  let fixture: ComponentFixture<GmcMaternityBenifitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcMaternityBenifitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcMaternityBenifitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
