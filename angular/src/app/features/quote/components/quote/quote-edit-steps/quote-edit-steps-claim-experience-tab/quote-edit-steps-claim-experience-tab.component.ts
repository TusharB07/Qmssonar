import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
  selector: 'app-quote-edit-steps-claim-experience-tab',
  templateUrl: './quote-edit-steps-claim-experience-tab.component.html',
  styleUrls: ['./quote-edit-steps-claim-experience-tab.component.scss']
})
export class QuoteEditStepsClaimExperienceTabComponent implements OnInit {

  private currentQuote: Subscription;

  quote: IQuoteSlip;

  private currentPropertyQuoteOption: Subscription;                      // New_Quote_option
  quoteOptionData: IQuoteOption                                          // New_Quote_option

  constructor(
    private quoteService: QuoteService,
    private quoteOptionService: QuoteOptionService,
  ) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
      }
    })

    // New_Quote_option
    this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
      next: (dto: IQuoteOption) => {
        this.quoteOptionData = dto
      }
    });
  }

  ngOnInit(): void {
  }

}
