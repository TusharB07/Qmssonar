import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
    selector: 'app-risk-cover-letter-header',
    templateUrl: './risk-cover-letter-header.component.html',
    styleUrls: ['./risk-cover-letter-header.component.scss']
})
export class RiskCoverLetterHeaderComponent implements OnInit {

    @Input() quote: IQuoteSlip;

    private renewalPolicyDate: string;

    constructor(
    ) {

    }

    ngOnInit(): void {
        const date = new Date(this.quote?.riskStartDate);
        const renewalPolicyPeriod = this.quote?.renewalPolicyPeriod;
        const renewalPolicyPeriodInMonths = parseInt(renewalPolicyPeriod); // extract numeric value from string
        const renewalPolicyDate = new Date(date.getFullYear(), date.getMonth() + renewalPolicyPeriodInMonths, date.getDate()); //get a next renewal policy period date 
        this.renewalPolicyDate = renewalPolicyDate.toISOString();
    }

}
