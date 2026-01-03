import { OnDestroy } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IOneResponseDto } from 'src/app/app.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-other-details-crud-card',
    templateUrl: './other-details-crud-card.component.html',
    styleUrls: ['./other-details-crud-card.component.scss']
})
export class OtherDetailsCrudCardComponent implements OnInit{

    quote: IQuoteSlip 
    private currentQuote: Subscription;

    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option

    constructor(
        private quoteService: QuoteService,
        private quoteOptionService: QuoteOptionService,
    ) {
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
            }
        })
    }
    
    ngOnInit(): void {
    }

}
