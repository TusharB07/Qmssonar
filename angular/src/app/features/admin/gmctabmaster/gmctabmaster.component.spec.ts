import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmctabmasterComponent } from './gmctabmaster.component';

describe('GmctabmasterComponent', () => {
  let component: GmctabmasterComponent;
  let fixture: ComponentFixture<GmctabmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmctabmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmctabmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
