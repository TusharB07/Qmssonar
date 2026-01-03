import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-sum-insured-details-tab',
    templateUrl: './sum-insured-details-tab.component.html',
    styleUrls: ['./sum-insured-details-tab.component.scss']
})
export class SumInsuredDetailsTabComponent implements OnInit {

    quote: IQuoteSlip

    @Input() permissions: PermissionType[] = ['read', 'update']

    toWord = new ToWords();
    private currentQuote: Subscription;

    uploadRiskInspectionReportUrl: string;
    uploadLocationPhotographsUrl: string;

    uploadHttpHeaders: HttpHeaders;

    AllowedProductTemplate = AllowedProductTemplate;
    
    private currentPropertyQuoteOption: Subscription;       // New_Quote_option
    quoteOptionData: IQuoteOption     // New_Quote_option

    constructor(
        private quoteService: QuoteService,
        private dialogService: DialogService,
        private accountService: AccountService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private quoteOptionService: QuoteOptionService,
    ) {
        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();

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

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

}
