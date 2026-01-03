import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { throwIfEmpty } from 'rxjs/operators';
import { IOneResponseDto } from 'src/app/app.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { Subscription } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';

@Component({
    selector: 'app-other-details-liability-tab',
    templateUrl: './other-details-liability-tab.component.html',
    styleUrls: ['./other-details-liability-tab.component.scss']
})
export class OtherDetailsLiabilityTabComponent implements OnInit {

    quote: IQuoteSlip

    toWords = new ToWords();

    today: string;
    showLiabilityCrudView:Boolean=false
    private currentQuote: Subscription;
    AllowedProductTemplate = AllowedProductTemplate

    constructor(
        private quoteService: QuoteService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private messageService: MessageService
    ) {
        this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote

                //
                if (this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_EANDO
                    || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY
                    || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CGL
                    || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_PRODUCT
                    || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CYBER
                    || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CRIME
                    || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_PUBLIC
                    || this.quote.productId["productTemplate"] == AllowedProductTemplate.WORKMENSCOMPENSATION) {
                    this.showLiabilityCrudView = true;
                }
                else {
                    this.showLiabilityCrudView = false;
    
                }
            }
        })

    }

    ngOnInit(): void {


    }

    ngOnDestroy(): void {

    }




}
