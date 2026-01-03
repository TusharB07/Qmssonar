import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IProduct } from 'src/app/features/admin/product/product.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { ILocationBasedCovers, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
    selector: 'app-toggle-cover-opted-radio',
    templateUrl: './toggle-cover-opted-radio.component.html',
    styleUrls: ['./toggle-cover-opted-radio.component.scss']
})
export class ToggleCoverOptedRadioComponent implements OnInit {

    isBLUS: boolean;
    isGHRP: boolean;
    isFIPR: boolean;
    isMMPP: boolean;
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
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = [];
    permissionsEarthquake: boolean;
    permissionsSTFI: boolean;
    permissionsTerrorism: boolean;
    private currentQuote: Subscription;

    private currentPropertyQuoteOption: Subscription;                      // New_Quote_option
    quoteOptionData: IQuoteOption                                          // New_Quote_option

    constructor(
        private quoteService: QuoteService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private accountService: AccountService,
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
                //     this.isFlexa = true
                // }
            }
        })



        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote

                let product: IProduct = quote.productId as IProduct;

                switch (product.shortName) {
                    case 'FIPR': // Fire
                        this.isStfiToggleEnabled = true;
                        this.isEarthquakeToggleEnabled = true;
                        this.isTerrorismToggleEnabled = true;
                        break;
                    case 'BGRP': // Bharat Griha Raksha Policy
                        this.isStfiToggleEnabled = true;
                        this.isEarthquakeToggleEnabled = true;
                        this.isTerrorismToggleEnabled = true;
                        break
                }
            }
        }
        )

        this.currentUser$ = this.accountService.currentUser$

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOptionData = dto

                if (dto) {
                    this.isFlexa = dto?.locationBasedCovers?.quoteLocationOccupancy?.isFlexa;
                    this.isStfi = dto?.locationBasedCovers?.quoteLocationOccupancy?.isStfi;
                    this.isEarthquake = dto?.locationBasedCovers?.quoteLocationOccupancy?.isEarthquake;
                    this.isTerrorism = dto?.locationBasedCovers?.quoteLocationOccupancy?.isTerrorism;
                    this.isFlexa = true
                }
            }
        });

    }

    ngOnInit(): void {
        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM) {

                    this.permissionsEarthquake = true
                    this.permissionsSTFI = true
                    this.permissionsTerrorism = true
                }
            }
        })
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

    // Old_Quote
    // coversOptedChanged(coverName, $event) {

    //     const payload = {
    //         coverName: coverName,
    //         coverValue: $event.checked,
    //         quoteLocationOccupancyId: this.quote?.locationBasedCovers?.quoteLocationOccupancy._id
    //     }

    //     console.log(payload)

    //     this.quoteLocationOccupancyService.toggleCovers(payload).subscribe({
    //         next: (dto: IOneResponseDto<any>) => {
    //             console.log(dto.data.entity)

    //             this.quoteService.get(this.quote._id, { quoteLocationOccupancyId: this.quote?.locationBasedCovers?.quoteLocationOccupancy._id }).subscribe({
    //                 next: (dto: IOneResponseDto<IQuoteSlip>) => {

    //                     this.quoteService.setQuote(dto.data.entity)
    //                 }
    //             })
    //         },
    //         error: e => { }
    //     });
    // }

    // New_Quote_option
    coversOptedChanged(coverName, $event) {

        const payload = {
            coverName: coverName,
            coverValue: $event.checked,
            quoteLocationOccupancyId: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy._id
        }

        console.log(payload)

        this.quoteLocationOccupancyService.toggleCovers(payload).subscribe({
            next: (dto: IOneResponseDto<any>) => {

                this.quoteOptionService.get(this.quoteOptionData._id, { quoteLocationOccupancyId: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy._id }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    }
                })
            },
            error: e => { }
        });
    }
}
