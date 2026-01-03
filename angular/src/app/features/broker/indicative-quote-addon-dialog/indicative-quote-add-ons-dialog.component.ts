import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AllowedAddonCoverCategory } from '../../admin/addon-cover/addon-cover.model';
import { IQuoteOption, IQuoteSlip } from '../../admin/quote/quote.model';

@Component({
    selector: 'app-indicative-quote-add-ons-dialog',
    templateUrl: './indicative-quote-add-ons-dialog.component.html',
    styleUrls: ['./indicative-quote-add-ons-dialog.component.scss']
})
export class IndicativeQuoteAddOnsDialogComponent implements OnInit {

    quote: IQuoteSlip;

    quoteOptionData: IQuoteOption    // New_Quote_Option

    selectedSectorAvgPaidCovers;
    constructor(
        public config: DynamicDialogConfig
    ) {
        this.quote = this.config?.data?.quote_id

        this.quoteOptionData = this.config?.data?.quoteOptionData                // New_Quote_Option
    }

    ngOnInit(): void {
        // this.selectedSectorAvgPaidCovers = this.quote.locationBasedCovers?.conditonalBasedAddOn               // Old_Quote
        this.selectedSectorAvgPaidCovers = this.quoteOptionData.locationBasedCovers?.conditonalBasedAddOn        // New_Quote_Option
            .filter(item => item.isChecked)
            .filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)
            .filter(item => item?.addOnCoverId?.sectorId?.name == this.quote.sectorId["name"])
            .map(item => item.addOnCoverId.name);
    }

}
