import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmcFileTemplateComponent } from './gmc-file-template.component';

describe('GmcFileTemplateComponent', () => {
  let component: GmcFileTemplateComponent;
  let fixture: ComponentFixture<GmcFileTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmcFileTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmcFileTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
