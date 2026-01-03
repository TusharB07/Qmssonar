import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcEnhancedCoversTabComponent } from './gmc-enhanced-covers-tab.component';

describe('GmcEnhancedCoversTabComponent', () => {
  let component: GmcEnhancedCoversTabComponent;
  let fixture: ComponentFixture<GmcEnhancedCoversTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcEnhancedCoversTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcEnhancedCoversTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
