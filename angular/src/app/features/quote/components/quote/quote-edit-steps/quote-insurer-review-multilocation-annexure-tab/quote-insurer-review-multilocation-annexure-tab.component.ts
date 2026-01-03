import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { Subscription } from 'rxjs';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { PincodeService } from 'src/app/features/admin/pincode/pincode.service';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { LazyLoadEvent } from 'primeng/api';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-quote-insurer-review-multilocation-annexure-tab',
    templateUrl: './quote-insurer-review-multilocation-annexure-tab.component.html',
    styleUrls: ['./quote-insurer-review-multilocation-annexure-tab.component.scss']
})
export class QuoteInsurerReviewMultilocationAnnexureTabComponent implements OnInit {

    id: string; _
    activeIndex2: number = 0;
    quote: IQuoteSlip;
    AllowedProductTemplate = AllowedProductTemplate
    private currentQuote: Subscription;
    selectedQuoteLocationOccpancyId: string;
    occupancyCount: number = 0;

    private currentPropertyQuoteOption: Subscription;                      // New_Quote_option
    quoteOptionData: IQuoteOption                                            // New_Quote_option
    isLockton: boolean = environment.isLokton
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private pincodeService: PincodeService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private quoteOptionService: QuoteOptionService,
    ) {

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
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
        // Old_Quote
        // let lazyLoadEvent: LazyLoadEvent = {
        //     first: 0,
        //     rows: 20,
        //     sortField: null,
        //     sortOrder: 1,
        //     filters: {
        //         // @ts-ignore
        //         quoteId: [
        //             {
        //                 value: this.quote._id,
        //                 matchMode: "equals",
        //                 operator: "and"
        //             }
        //         ]
        //     },
        //     globalFilter: null,
        //     multiSortMeta: null
        // };

        // New_Quote_option
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.quoteOptionData._id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        this.quoteLocationOccupancyService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
                this.occupancyCount = dto.data.entities.length
            },
            error: e => { }
        });
    }


    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

    //   previousPage() {
    //     this.router.navigateByUrl(`backend/quotes/${this.quoteId}/edit/sum-insured-details`);
    //   }
    //   nextPage() {
    //     this.router.navigateByUrl(`backend/quotes/${this.quoteId}/edit/add-on`);
    //   }
}
