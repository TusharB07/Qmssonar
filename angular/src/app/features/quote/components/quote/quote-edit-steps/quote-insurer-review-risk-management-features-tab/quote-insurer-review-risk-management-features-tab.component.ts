import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { RiskManagementFeaturesService } from 'src/app/features/admin/risk-management-features/risk-management-features.service';




@Component({
  selector: 'app-quote-insurer-review-risk-management-features-tab',
  templateUrl: './quote-insurer-review-risk-management-features-tab.component.html',
  styleUrls: ['./quote-insurer-review-risk-management-features-tab.component.scss'],
})


export class QuoteInsurerReviewRiskManagementFeaturesTabComponent implements OnInit {

  expanded = false;
  private currentQuote: Subscription;

  @Input() permissions: PermissionType[] = []

  quote: IQuoteSlip;
  selectedQuoteLocationOccpancyId: string;
  newRiskManagementFeature: any;
  selectedRiskManagementFeatures: any[] = [];
  riskManagementFeatures: any[] = [];
  saveDialogeFlag: boolean = false;

  private currentPropertyQuoteOption: Subscription;                              // New_Quote_Option
  quoteOptionData: IQuoteOption                                                  // New_Quote_Option

  constructor(
    private riskManagementFeaturesService: RiskManagementFeaturesService,
    private quoteService: QuoteService,
    private quoteOptionService: QuoteOptionService,
  ) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote;
      }
    });

    // New_Quote_option
    this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
      next: (dto) => {
        this.quoteOptionData = dto
      }
    });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }

}
