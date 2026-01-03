import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';

@Component({
  selector: 'app-risk-management-features-dialog',
  templateUrl: './risk-management-features-dialog.component.html',
  styleUrls: ['./risk-management-features-dialog.component.scss']
})
export class RiskManagementFeaturesDialogComponent implements OnInit {

  quote: IQuoteSlip;
  riskManagementFeatures: any[] = [];
  selectedRiskManagementFeatures: any[] = [];

  selectedSectorAvgPaidCovers;
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {
    this.quote = this.config?.data?.quote_id;
    this.riskManagementFeatures = this.config?.data?.riskManagementFeatures;
    this.selectedRiskManagementFeatures = this.config?.data?.selectedRiskManagementFeatures;
  }
  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.ref.close(this.selectedRiskManagementFeatures);
  }
}
