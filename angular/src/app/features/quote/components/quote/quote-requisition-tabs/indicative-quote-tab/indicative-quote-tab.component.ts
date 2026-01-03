import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IndicativeQuoteAddOnsDialogComponent } from 'src/app/features/broker/indicative-quote-addon-dialog/indicative-quote-add-ons-dialog.component';
import { IndicativeQuoteViewDetailsDialogComponent } from 'src/app/features/broker/indicative-quote-view-details-dialog/indicative-quote-view-details-dialog.component';
import { ToWords } from 'to-words';
import { Subscription } from 'rxjs';
import { IndicativeQuoteViewQuoteBreakupDialogComponent } from 'src/app/features/broker/indicative-quote-view-quote-breakup-dialog/indicative-quote-view-quote-breakup-dialog.component';
import { AllowedAddonCoverCategory } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-indicative-quote-tab',
    templateUrl: './indicative-quote-tab.component.html',
    styleUrls: ['./indicative-quote-tab.component.scss']
})
export class IndicativeQuoteTabComponent implements OnInit {

    quote: IQuoteSlip

    toWords = new ToWords();
    private currentQuote: Subscription;

    coversOptedCount = 0;

    flexaCovers: number;
    type: AllowedAddonCoverCategory;
    sectorAvgPaidCovers = [];
    selectedSectorAvgPaidCovers: number;
    selectedConditionalFreeAddOnsCovers: number;

    higherLocationDetails: IQuoteLocationOccupancy
    selectedLocationName: string = '';
    isMobile: boolean = false;

    private currentPropertyQuoteOption: Subscription;       // New_Quote_option
    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option

    constructor(
        private quoteService: QuoteService,
        private dialogService: DialogService,
        private deviceDetectorService: DeviceDetectorService,
        private quoteOptionService: QuoteOptionService,
    ) {
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
                // const results = Object.values(this.quote?.locationBasedCovers?.higherSumAssuredLocation)
                // const results = Object.values(this.quote?.locationBasedCovers?.higherSumAssuredLocation)            
                // this.coversOptedCount = 0;

                // this.higherLocationDetails = this.quote.locationBasedCovers.quoteLocationOccupancy              

                // if (this.higherLocationDetails.isFlexa) {
                //     this.coversOptedCount++;
                // }
                // if (this.higherLocationDetails.isEarthquake) {
                //     this.coversOptedCount++;
                // }
                // if (this.higherLocationDetails.isStfi) {
                //     this.coversOptedCount++;
                // }
                // if (this.higherLocationDetails.isTerrorism) {
                //     this.coversOptedCount++;
                // }

                // const flexaCover = this.quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)?.filter(item => item.addOnCoverId?.addonTypeFlag == 'Free');
                // this.flexaCovers = (flexaCover).length

                // const selectedSectorAvgPaidCover = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)?.filter(item => item.isChecked == true && item?.addOnCoverId?.addonTypeFlag == 'Paid').map(item => item.addOnCoverId.name);
                // // console.log(this.selectedSectorAvgPaidCovers);
                // this.selectedSectorAvgPaidCovers = selectedSectorAvgPaidCover.length
                // const selectedConditionalFreeAddOnsCover = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)?.filter(item => item.isChecked == true && item?.addOnCoverId?.addonTypeFlag != 'Free' && item?.addOnCoverId?.addonTypeFlag != 'Paid').map(item => item.addOnCoverId.name);
                // this.selectedConditionalFreeAddOnsCovers = selectedConditionalFreeAddOnsCover.length

            }
        })
        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (quoteOption: IQuoteOption) => {
                this.quoteOptionData = quoteOption

                // const results = Object.values(this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation)     // New_Quote_Option
                this.coversOptedCount = 0;

                // this.higherLocationDetails = this.quote.locationBasedCovers.quoteLocationOccupancy              // Old_Quote
                this.higherLocationDetails = this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy       // New_Quote_Option

                if (this.higherLocationDetails?.isFlexa) {
                    this.coversOptedCount++;
                }
                if (this.higherLocationDetails?.isEarthquake) {
                    this.coversOptedCount++;
                }
                if (this.higherLocationDetails?.isStfi) {
                    this.coversOptedCount++;
                }
                if (this.higherLocationDetails?.isTerrorism) {
                    this.coversOptedCount++;
                }

                const flexaCover = this.quoteOptionData?.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)?.filter(item => item.addOnCoverId?.addonTypeFlag == 'Free');
                this.flexaCovers = flexaCover?.length

                const selectedSectorAvgPaidCover = quoteOption?.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)?.filter(item => item.isChecked == true && item?.addOnCoverId?.addonTypeFlag == 'Paid').map(item => item.addOnCoverId.name);
                this.selectedSectorAvgPaidCovers = selectedSectorAvgPaidCover?.length
                const selectedConditionalFreeAddOnsCover = quoteOption?.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)?.filter(item => item.isChecked == true && item?.addOnCoverId?.addonTypeFlag != 'Free' && item?.addOnCoverId?.addonTypeFlag != 'Paid').map(item => item.addOnCoverId.name);
                this.selectedConditionalFreeAddOnsCovers = selectedConditionalFreeAddOnsCover?.length
            }
        });

    }
    

    ngOnInit(): void {
        // let locationNameBreakup = this.quote.locationBasedCovers?.quoteLocationOccupancy?.locationName.split(',');            // Old_Quote
        let locationNameBreakup = this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.locationName.split(',');     // New_Quote_Option
        this.selectedLocationName = locationNameBreakup[0] + ' - ' + locationNameBreakup[5];
        this.isMobile = this.deviceDetectorService.isMobile();
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
        // this.currentPropertyQuoteOption.unsubscribe();

    }

    openViewQuoteBreakupDialog() {
        // let splitLocation = this.quote.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')         // Old_Quote
        let splitLocation = this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')  // New_Quote_Option
        const ref = this.dialogService.open(IndicativeQuoteViewQuoteBreakupDialogComponent, {
            header: "Breakup of Total Indicative Pricing : " + splitLocation[0] + " -" + splitLocation[splitLocation.length - 2],
            data: {
                quote: this.quote,
                quoteOptionData: this.quoteOptionData,
            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: "customPopup"
        })
    }

    openViewDetailsDialog() {
        /* const ref = this.dialogService.open(IndicativeQuoteViewDetailsDialogComponent, {
            header: "Total Indicative Quote",
            data: {
                quote_id: this.quote._id,
                // quote_id : this.quote_id,
                // clientLocationId : this.clientLocationId
            },
            width: '70%',
            styleClass: "customPopup"
        }) */
    }

    openAddOnsDialog() {
        // let splitLocation = this.quote.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')         // Old_Quote
        let splitLocation = this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')  // New_Quote_Option
        const ref = this.dialogService.open(IndicativeQuoteAddOnsDialogComponent, {
            header: "Add Ons: " + splitLocation[0] + " -" + splitLocation[splitLocation.length - 2],
            data: {
                quote_id: this.quote,
                quoteOptionData: this.quoteOptionData,
                // clientLocationId : this.clientLocationId
            },
            width: "70%",
            styleClass: "customPopup"
        });
    }


}
