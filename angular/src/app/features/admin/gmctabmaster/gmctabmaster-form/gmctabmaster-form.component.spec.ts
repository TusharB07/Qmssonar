import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmctabmasterFormComponent } from './gmctabmaster-form.component';

describe('GmctabmasterFormComponent', () => {
  let component: GmctabmasterFormComponent;
  let fixture: ComponentFixture<GmctabmasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmctabmasterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmctabmasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
