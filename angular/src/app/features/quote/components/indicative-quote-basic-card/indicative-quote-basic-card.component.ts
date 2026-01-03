import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteLocationBreakupDialogComponent } from 'src/app/features/quote/components/quote-location-breakup-dialog/quote-location-breakup-dialog.component';
import { ToWords } from 'to-words';
import { EditQuoteLocationSumInsuredDialogComponent } from '../edit-quote-location-sum-insured-dialog/edit-quote-location-sum-insured-dialog.component';

@Component({
    selector: 'app-indicative-quote-basic-card',
    templateUrl: './indicative-quote-basic-card.component.html',
    styleUrls: ['./indicative-quote-basic-card.component.scss']
})
export class IndicativeQuoteBasicCardComponent implements OnInit, OnChanges {

    @Input() quote: IQuoteSlip;

    AllowedProductTemplate = AllowedProductTemplate

    @Input() isShowBreakupType: boolean

    totalPremium = 0;
    basePremium = 0;
    sumInsured = 0;
    isMobile: boolean = false;
    toWord = new ToWords();

    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option


    constructor(
        private dialogService: DialogService,
        private quoteService: QuoteService,
        private deviceService: DeviceDetectorService
    ) {


    }

    ngOnInit(): void {
        // Old_Quote
        // this.totalPremium = this.quote.totalIndictiveQuoteAmt
        // this.basePremium = Number(this.quote?.totalFlexa) + Number(this.quote?.totalStfi) + Number(this.quote?.totalEarthquake) + Number(this.quote?.totalTerrorism)
        // this.isMobile = this.deviceService.isMobile();
        // this.sumInsured = this.quote.totalSumAssured

        // New_Quote_Option
        this.totalPremium = this.quoteOptionData.totalIndictiveQuoteAmt
        this.basePremium = Number(this.quoteOptionData?.totalFlexa) + Number(this.quoteOptionData?.totalStfi) + Number(this.quoteOptionData?.totalEarthquake) + Number(this.quoteOptionData?.totalTerrorism)
        this.isMobile = this.deviceService.isMobile();
        this.sumInsured = this.quoteOptionData.totalSumAssured
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Old_Quote
        // this.quote = changes.quote.currentValue;
        // this.totalPremium = this.quote.totalIndictiveQuoteAmt
        // this.basePremium = Number(this.quote?.totalFlexa) + Number(this.quote?.totalStfi) + Number(this.quote?.totalEarthquake) + Number(this.quote?.totalTerrorism)
        // this.sumInsured = this.quote.totalSumAssured

        // New_Quote_Option
        // this.quoteOptionData = changes.quoteOptionData.currentValue;
        this.totalPremium = this.quoteOptionData.totalIndictiveQuoteAmt
        this.basePremium = Number(this.quoteOptionData?.totalFlexa) +
            Number(this.quoteOptionData?.totalStfi) +
            Number(this.quoteOptionData?.totalEarthquake) +
            Number(this.quoteOptionData?.totalTerrorism)
        this.sumInsured = this.quoteOptionData.totalSumAssured
    }

    openSumInsuredSplitDialog() {

        const ref = this.dialogService.open(QuoteLocationBreakupDialogComponent, {
            header: "Edit Sum Insured Split",
            data: {
                quote: this.quote,
                quoteOptionData: this.quoteOptionData,
                // selectedLocation: this.quote.locationBasedCovers.quoteLocationOccupancy                   // Old_Quote
                selectedLocation: this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy            // New_Quote_Option
            },
            width: this.isMobile ? '98vw' : '1200px',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe(() => {

        });
    }

    EditSumInsuredDialog() {

        const ref = this.dialogService.open(EditQuoteLocationSumInsuredDialogComponent, {
            header: "Edit Quote Location Sum Insured",
            data: {
                quote: this.quote,
                quoteOption: this.quoteOptionData,
                // selectedLocation: this.quote.locationBasedCovers.quoteLocationOccupancy                   // Old_Quote
                selectedLocation: this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy            // New_Quote_Option
            },
            width: '30%',
            styleClass: 'customPopup'
        })
    }

    ngOnDestroy(): void {
    }
}
