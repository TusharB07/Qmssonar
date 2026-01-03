import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcEnhancedCoversComponent } from './gmc-enhanced-covers.component';

describe('GmcEnhancedCoversComponent', () => {
  let component: GmcEnhancedCoversComponent;
  let fixture: ComponentFixture<GmcEnhancedCoversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcEnhancedCoversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcEnhancedCoversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
