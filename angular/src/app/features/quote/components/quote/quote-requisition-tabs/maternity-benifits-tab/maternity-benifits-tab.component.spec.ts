import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaternityBenifitsTabComponent } from './maternity-benifits-tab.component';

describe('MaternityBenifitsTabComponent', () => {
  let component: MaternityBenifitsTabComponent;
  let fixture: ComponentFixture<MaternityBenifitsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaternityBenifitsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaternityBenifitsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
