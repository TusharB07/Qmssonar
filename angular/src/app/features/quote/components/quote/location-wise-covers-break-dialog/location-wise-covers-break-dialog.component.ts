import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IOneResponseDto } from 'src/app/app.model';
import { Subscription } from 'rxjs';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AppService } from 'src/app/app.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-location-wise-covers-break-dialog',
    templateUrl: './location-wise-covers-break-dialog.component.html',
    styleUrls: ['./location-wise-covers-break-dialog.component.scss']
})
export class LocationWiseCoversBreakDialogComponent implements OnInit {

    quote: IQuoteSlip;

    locationWiseBreakupData: any[] = [];

    selectedLocation: any

    grandTotal = 0

    private currentQuote: Subscription;
    isMobile: boolean = false;

    private currentPropertyQuoteOption: Subscription;       // New_Quote_option
    quoteOptionData: IQuoteOption                           // New_Quote_Option

    constructor(
        private config: DynamicDialogConfig,
        private quoteService: QuoteService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private appService: AppService,
        private deviceService: DeviceDetectorService,
        private quoteOptionService: QuoteOptionService,
    ) {
        this.quote = this.quote || this.config?.data?.quote;

        this.quoteOptionData = this.quote || this.config?.data?.quoteOptionData;          // New_Quote_option

        this.selectedLocation = this.config.data.selectedLocation

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote;
                // this.getLocationWiseBreakup();            // Old_Quote

            }
        })

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOptionData = dto
                this.getLocationWiseBreakup();
            }
        });
    }

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
        // this.currentPropertyQuoteOption.unsubscribe();
    }

    getLocationWiseBreakup() {
        let payload = {};
        // Old_Quote
        // payload['quoteId'] = this.quote._id;
        // this.quoteService.viewLocationWiseBreakup(payload).subscribe({

        // New_Quote_option
        payload['quoteOptionId'] = this.quoteOptionData._id;
        this.quoteOptionService.viewLocationWiseBreakup(payload).subscribe({
            next: breakup => {
                this.locationWiseBreakupData = breakup.data.entities;
                console.log(this.locationWiseBreakupData);
                
                this.grandTotal = 0
                this.locationWiseBreakupData.forEach(location => {
                    this.grandTotal += Number(location.quoteLocationOccupancy.totalPremium ?? 0) + Number(location.quoteLocationOccupancy.totalPremiumWithDiscount ?? 0)
                })
                const selectedLocationIndex = this.locationWiseBreakupData.findIndex(item => item.quoteLocationOccupancy._id === this.selectedLocation._id)
                const object = this.locationWiseBreakupData[selectedLocationIndex]
                if (selectedLocationIndex !== -1 || selectedLocationIndex !== undefined) {
                    // Remove the object from its current position
                    this.locationWiseBreakupData.splice(selectedLocationIndex, 1);

                    // Insert the object at the beginning of the array
                    this.locationWiseBreakupData.unshift(object);
                }
            }
        })
    }

    downloadSampleFile() {
        // Old_Quote
        // this.quoteLocationOccupancyService.downloadLocationWiseBreakExcel(this.quote?._id).subscribe({

        // New_Quote_option
        this.quoteLocationOccupancyService.downloadLocationWiseBreakExcel(this.quote?._id, {quoteOptionId: this.quoteOptionData._id}).subscribe({
            next: (response: any) => this.appService.downloadSampleExcel(response),
            error: e => {
                console.log(e)
            }
        })
    }

}
