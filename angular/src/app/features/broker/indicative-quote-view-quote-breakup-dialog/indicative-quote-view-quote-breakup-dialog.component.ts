import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IQuoteLocationOccupancy } from '../../admin/quote-location-occupancy/quote-location-occupancy.model';
import { IQuoteSlip } from '../../admin/quote/quote.model';
import { QuoteService } from '../../admin/quote/quote.service';
import { QuoteOptionService } from '../../admin/quote/quoteOption.service';

@Component({
    selector: 'app-indicative-quote-view-quote-breakup-dialog',
    templateUrl: './indicative-quote-view-quote-breakup-dialog.component.html',
    styleUrls: ['./indicative-quote-view-quote-breakup-dialog.component.scss']
})
export class IndicativeQuoteViewQuoteBreakupDialogComponent implements OnInit {

    locationWiseBreakupData: any[] = [];

    total = 0;

    constructor(
        public config: DynamicDialogConfig,
        private quoteService: QuoteService,
        private quoteOptionService: QuoteOptionService,
    ) { }

    ngOnInit(): void {
        // this.getLocationWiseBreakup();                                     // Old_Quote
        this.getQuoteOptionLocationWiseBreakup()                              // New_Quote_Option
        // this.locationWiseBreakupData = this.config.data.quote?.locationBasedCovers.quoteLocationOccupancy;
    }

    getLocationWiseBreakup() {
        let payload = {};
        payload['quoteId'] = this.config.data.quote?._id;
        this.quoteService.viewLocationWiseBreakup(payload).subscribe({
            next: breakup => {
                this.locationWiseBreakupData = breakup.data.entities.filter(item => item.quoteLocationOccupancy.locationName === this.config.data.quote.locationBasedCovers.quoteLocationOccupancy.locationName && item.quoteLocationOccupancy._id === this.config.data.quote.locationBasedCovers.quoteLocationOccupancy._id);

                const qlo: IQuoteLocationOccupancy = this.config.data.quote.locationBasedCovers.quoteLocationOccupancy;

                this.total = Number(qlo.earthquakePremium ?? 0) +
                    Number(qlo.STFIPremium ?? 0) +
                    Number(qlo.flexaPremium ?? 0) +
                    Number(qlo.terrorismPremium ?? 0);
            }
        })
    }

    getQuoteOptionLocationWiseBreakup() {
        let payload = {};
        payload['quoteOptionId'] = this.config.data.quoteOptionData?._id;
        this.quoteOptionService.viewLocationWiseBreakup(payload).subscribe({
            next: breakup => {
                this.locationWiseBreakupData = breakup.data.entities.filter(item => item.quoteLocationOccupancy.locationName === this.config.data.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.locationName && item.quoteLocationOccupancy._id === this.config.data.quoteOptionData.locationBasedCovers.quoteLocationOccupancy._id);

                const qlo: IQuoteLocationOccupancy = this.config.data.quoteOptionData.locationBasedCovers.quoteLocationOccupancy;

                this.total = Number(qlo.earthquakePremium ?? 0) +
                    Number(qlo.STFIPremium ?? 0) +
                    Number(qlo.flexaPremium ?? 0) +
                    Number(qlo.terrorismPremium ?? 0);
            }
        })
    }

}
