import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcFamilyCompositionComponent } from './gmc-family-composition.component';

describe('GmcFamilyCompositionComponent', () => {
  let component: GmcFamilyCompositionComponent;
  let fixture: ComponentFixture<GmcFamilyCompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcFamilyCompositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcFamilyCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
