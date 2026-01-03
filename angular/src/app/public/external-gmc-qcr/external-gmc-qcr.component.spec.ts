import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalGmcQcrComponent } from './external-gmc-qcr.component';

describe('ExternalGmcQcrComponent', () => {
  let component: ExternalGmcQcrComponent;
  let fixture: ComponentFixture<ExternalGmcQcrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalGmcQcrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalGmcQcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
