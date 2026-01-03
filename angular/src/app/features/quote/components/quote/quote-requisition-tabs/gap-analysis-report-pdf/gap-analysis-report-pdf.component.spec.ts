import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GapAnalysisReportPdfComponent } from './gap-analysis-report-pdf.component';

describe('GapAnalysisReportPdfComponent', () => {
  let component: GapAnalysisReportPdfComponent;
  let fixture: ComponentFixture<GapAnalysisReportPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GapAnalysisReportPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GapAnalysisReportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
