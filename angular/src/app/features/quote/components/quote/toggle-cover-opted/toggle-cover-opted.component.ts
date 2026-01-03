import { Component, Input, OnInit } from '@angular/core';
import { IOneResponseDto } from 'src/app/app.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { ILocationBasedCovers, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { Subscription } from 'rxjs';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-toggle-cover-opted',
    templateUrl: './toggle-cover-opted.component.html',
    styleUrls: ['./toggle-cover-opted.component.scss']
})
export class ToggleCoverOptedComponent implements OnInit {


    quote: IQuoteSlip;
    locationBasedCovers: ILocationBasedCovers;
    isFlexa = false;
    isStfi = false;
    isEarthquake = false;
    isTerrorism = false;
    isFlexaToggleEnabled = false;
    isStfiToggleEnabled = false;
    isEarthquakeToggleEnabled = false;
    isTerrorismToggleEnabled = false;
    @Input() isConditionAddon: boolean = false
    private currentQuote: Subscription;
    private currentPropertyQuoteOption: Subscription;                           // New_Quote_option
    quoteOptionData: IQuoteOption                                               // New_Quote_Option
    locationWiseBreakupData: any[] = [];

    constructor(
        private quoteService: QuoteService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private quoteOptionService: QuoteOptionService,
    ) {
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
                // Old_Quote
                // if (quote) {
                //     this.isFlexa = quote?.locationBasedCovers?.quoteLocationOccupancy?.isFlexa;
                //     this.isStfi = quote?.locationBasedCovers?.quoteLocationOccupancy?.isStfi;
                //     this.isEarthquake = quote?.locationBasedCovers?.quoteLocationOccupancy?.isEarthquake;
                //     this.isTerrorism = quote?.locationBasedCovers?.quoteLocationOccupancy?.isTerrorism;
                //     // this.isFlexa = true
                // }
            }
        })

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOptionData = dto

                if (dto) {
                    this.isFlexa = dto?.locationBasedCovers?.quoteLocationOccupancy?.isFlexa;
                    this.isStfi = dto?.locationBasedCovers?.quoteLocationOccupancy?.isStfi;
                    this.isEarthquake = dto?.locationBasedCovers?.quoteLocationOccupancy?.isEarthquake;
                    this.isTerrorism = dto?.locationBasedCovers?.quoteLocationOccupancy?.isTerrorism;
                    // this.isFlexa = true
                }
            }
        });



        // this.currentQuote = this.quoteService.currentQuote$.subscribe({
        //     next: (quote: IQuoteSlip) => {
        //         this.quote = quote
        //         // this.sectorAvgPaidCovers = quote?.locationBasedCovers?.conditonalBasedAddOn?.filter(item => item.freeUpToText == 'Paid');
        //         // this.conditionalFreeCovers = quote?.locationBasedCovers?.conditonalBasedAddOn?.filter(item => item.freeUpToText != 'Paid');
        //         // console.log(this.quote)
        //         // if (quote) {

        //         // this.isBLUS = false;
        //         // this.isGHRP = false;
        //         // this.isFIPR = false;
        //         // this.isMMPP = false;


        //         let product: IProduct = quote.productId as IProduct;

        //         switch (product['productTemplate']) {
        //             case AllowedProductTemplate.BLUS: // BLUS
        //                 switch (product.shortName) {
        //                     case 'BGRP': // Bharat Griha Raksha Policy
        //                         this.isFlexaToggleEnabled = true;
        //                         break
        //                 }
        //                 break;
        //             case AllowedProductTemplate.FIRE: // Fire
        //                 this.isStfiToggleEnabled = true;
        //                 this.isEarthquakeToggleEnabled = true;
        //                 this.isTerrorismToggleEnabled = true;
        //                 break;
        //             case AllowedProductTemplate.IAR: // IAR
        //                 this.isStfiToggleEnabled = true;
        //                 this.isEarthquakeToggleEnabled = true;
        //                 this.isTerrorismToggleEnabled = true;
        //                 break;

        //         }
        //     }
        // }
        // )

        // this.quoteService.currentlocationBasedCovers$.subscribe({
        //     next: (locationBasedCovers: IlocationBasedCovers) => {
        //         this.locationBasedCovers = locationBasedCovers


        //         this.isFlexa = locationBasedCovers.quoteLocationOccupancy?.isFlexa;
        //         this.isStfi = locationBasedCovers.quoteLocationOccupancy?.isStfi;
        //         this.isEarthquake = locationBasedCovers.quoteLocationOccupancy?.isEarthquake;
        //         this.isTerrorism = locationBasedCovers.quoteLocationOccupancy?.isTerrorism;
        //         this.isFlexa = true
        //         console.log(locationBasedCovers);
        //     }
        // })


    }

    ngOnInit(): void {

        // if (this.isConditionAddon) {
        //     this.getQuoteOptionLocationWiseBreakup()
        // }
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
        // this.currentPropertyQuoteOption.unsubscribe();
    }

    coversOptedChanged(coverName, $event) {

        const payload = {
            coverName: coverName,
            coverValue: $event.checked,
            // quoteLocationOccupancyId: this.quote?.locationBasedCovers?.quoteLocationOccupancy._id             // Old_Quote
            quoteLocationOccupancyId: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy._id      // New_Quote_option
        }


        this.quoteLocationOccupancyService.toggleCovers(payload).subscribe({
            next: (dto: IOneResponseDto<any>) => {
                // Old_Quote
                // this.quoteService.get(this.quote._id, { quoteLocationOccupancyId: this.quote?.locationBasedCovers?.quoteLocationOccupancy._id }).subscribe({
                //     next: (dto: IOneResponseDto<IQuoteSlip>) => {

                //         this.quoteService.setQuote(dto.data.entity)
                //     }
                // })

                // New_Quote_option
                this.quoteOptionService.get(this.quoteOptionData._id, { quoteLocationOccupancyId: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy._id }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {

                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    }
                })
            },
            error: e => { }
        });
    }

    getQuoteOptionLocationWiseBreakup() {
        let payload = {};
        payload['quoteOptionId'] = this.quoteOptionData?._id;
        this.quoteOptionService.viewLocationWiseBreakup(payload).subscribe({
            next: breakup => {
                this.locationWiseBreakupData = breakup.data.entities.filter(item => item.quoteLocationOccupancy.locationName === this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.locationName && item.quoteLocationOccupancy._id === this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy._id);
            }
        })

    }

}
