import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionType } from 'src/app/app.model';
import { IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { IQuoteSlip, IQuoteGmcTemplate, FinalRater } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { RiskManagementFeaturesService } from 'src/app/features/admin/risk-management-features/risk-management-features.service';

@Component({
  selector: 'app-gmc-final-rater',
  templateUrl: './gmc-final-rater.component.html',
  styleUrls: ['./gmc-final-rater.component.scss']
})
export class GmcFinalRaterComponent implements OnInit {
  xpanded = false;
  private currentQuote: Subscription;
  private currentQuoteLocationOccupancyId: Subscription;
  private currentSelectedTemplate: Subscription;
  selectedQuoteTemplate: IQuoteGmcTemplate[];
  gmcTemplateData: IGMCTemplate[]
  tabsData: IGMCTemplate[] = []

  @Input() permissions: PermissionType[] = []
  finalRater: FinalRater = new FinalRater()
  quote: IQuoteSlip;
  selectedQuoteLocationOccpancyId: string;
  newRiskManagementFeature: any;
  selectedRiskManagementFeatures: any[] = [];
  riskManagementFeatures: any[] = [];
  saveDialogeFlag: boolean = false;

  products: any[]
  constructor(
    private riskManagementFeaturesService: RiskManagementFeaturesService,

    private quoteService: QuoteService,
  ) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote;
      }
    });

    this.currentSelectedTemplate = this.quoteService.currentQuoteOptions$.subscribe({
      next: (template) => {
        this.selectedQuoteTemplate = template;
       // this.finalRater = template.finalRater[0];
        this.calculateNetClaimAmount();
        this.calculateNetTotalAmount();
        this.calculateGrossTotalAmount();
        this.calculateInvestmentAmount();
        this.calculatePremium();
      }
    })
  }









  calculateNetClaimAmount() {
    this.finalRater.netClaimAmount = +this.finalRater.claimsPaidOutStanding - +this.finalRater.oneTimeClaims - +this.finalRater.covidClaims - +this.finalRater.claimsDuetoDeathOfEmployee;
    console.log("NetClaimAmount- " + this.finalRater.netClaimAmount);
  }

  calculateNetTotalAmount() {
    let adjustment = +this.finalRater.netClaimAmount * (+this.finalRater.adjustmentpercentage / 100)
    let ibnr = +this.finalRater.netClaimAmount * (+this.finalRater.ibnr / 100)
    let medicalInflation = +this.finalRater.netClaimAmount * (+this.finalRater.medicalInflation / 100)
    console.log("adjustment- " + adjustment);
    console.log("ibnr- " + ibnr);
    console.log("medicalInflation- " + medicalInflation);
    console.log("TotalALl- " + (+adjustment + +ibnr + +medicalInflation));
    this.finalRater.netToatlAmount = (+adjustment + +ibnr + +medicalInflation) + this.finalRater.netClaimAmount;
    console.log("netToatlAmount- " + this.finalRater.netToatlAmount);
  }

  calculateGrossTotalAmount() {
    let loading = +this.finalRater.netToatlAmount * (+this.finalRater.tpaLoading / 100)
    let brokarage = +this.finalRater.netToatlAmount * (+this.finalRater.brokerage / 100)
    let margin = +this.finalRater.netToatlAmount * (+this.finalRater.insurerMargin / 100)
    console.log("loading- " + loading);
    console.log("brokarage- " + brokarage);
    console.log("margin- " + margin);
    console.log("TotalALl- " + (+loading + +brokarage + +margin));
    this.finalRater.netGrossTotalAmount = (+loading + +brokarage + +margin) + this.finalRater.netToatlAmount;
    console.log("netGrossTotalAmount- " + this.finalRater.netGrossTotalAmount);
  }

  calculateInvestmentAmount() {
    let amount = +this.finalRater.netGrossTotalAmount * (+this.finalRater.investmentIncome / 100)
    console.log("InvestmentAmount- " + amount);
    this.finalRater.insurrerIncomeAmount = +this.finalRater.netGrossTotalAmount - amount
    console.log("insurrerIncomeAmount- " + this.finalRater.insurrerIncomeAmount);
  }

  calculatePremium() {
    this.finalRater.grandTotalAmount = 0
    let amount = +this.finalRater.insurrerIncomeAmount * (+this.finalRater.overAllLoadingDiscount / 100)
    let discAmount = this.finalRater.insurrerIncomeAmount - amount
    console.log("discAmount- " + discAmount);
    this.finalRater.grandTotalAmount = discAmount
    console.log("grandTotalAmount- " + this.finalRater.grandTotalAmount);
  }
  ngOnInit(): void {


  }


}
