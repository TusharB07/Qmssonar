import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
    selector: 'app-quote-insurer-review-risk-cover-letter-tab',
    templateUrl: './quote-insurer-review-risk-cover-letter-tab.component.html',
    styleUrls: ['./quote-insurer-review-risk-cover-letter-tab.component.scss']
})
export class QuoteInsurerReviewRiskCoverLetterTabComponent implements OnInit {
    quote: IQuoteSlip;
    id: string;


    private currentQuote: Subscription;

    constructor(
        private quoteService: QuoteService,

    ) {
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {

                this.quoteService.get(quote._id, { allCovers: true }).subscribe(({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => [

                        this.quote = dto.data.entity
                    ]
                }))

            }
        })
    }

    ngOnInit(): void {
    }

}
