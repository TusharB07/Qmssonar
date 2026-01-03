import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-select-location-occupany',
    templateUrl: './select-location-occupany.component.html',
    styleUrls: ['./select-location-occupany.component.scss']
})
export class SelectLocationOccupanyComponent implements OnInit {

    quote: IQuoteSlip;

    private currentPropertyQuoteOption: Subscription;             // New_Quote_option
    quoteOptionData: IQuoteOption                                   // New_Quote_option

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private quoteService: QuoteService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private appService: AppService,
        private quoteOptionService: QuoteOptionService,
    ) {
        this.quoteService.currentQuote$.subscribe({
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
        this.loadQuoteLocationOccupancies()
    }

    ngOnDestroy(): void {
    }

    optionsQuoteLocationOccupancies: ILov[];
    selectedQuoteLocationOccupancy: ILov

    loadQuoteLocationOccupancies() {
        // Old_Quote
        // let lazyLoadEvent: LazyLoadEvent = {
        //   first: 0,
        //   rows: 20,
        //   sortField: null,
        //   sortOrder: 1,
        //   filters: {
        //     // @ts-ignore
        //     quoteId: [
        //       {
        //         value: this.quote._id,
        //         matchMode: "equals",
        //         operator: "and"
        //       }
        //     ]
        //   },
        //   globalFilter: null,
        //   multiSortMeta: null
        // };

        // New_Quote_Option
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
                // console.log(dto.data.entities)
                // console.log(data)
                this.optionsQuoteLocationOccupancies = dto.data.entities.map((entity: IQuoteLocationOccupancy) => {
                    let clientLocation: IClientLocation = entity.clientLocationId as IClientLocation
                    let pincode: IPincode = entity.pincodeId as IPincode
                    return { label: `${clientLocation.locationName} - ${pincode.name}`, value: entity._id }
                });

                this.selectedQuoteLocationOccupancy = this.activatedRoute.snapshot.queryParams.location

                // Old_Quote
                // this.optionsQuoteLocationOccupancies = this.optionsQuoteLocationOccupancies.map(
                //     (lov: ILov) => lov.value == this.quote.locationBasedCovers?.higherSumAssuredLocation?._id ? { value: lov.value, label: `* ${lov.label.replace('*', '')}` } : lov
                // )

                // New_Quote_option
                this.optionsQuoteLocationOccupancies = this.optionsQuoteLocationOccupancies.map(
                    (lov: ILov) => lov.value == this.quoteOptionData.locationBasedCovers?.higherSumAssuredLocation?._id ? { value: lov.value, label: `* ${lov.label.replace('*', '')}` } : lov
                )
            },
            error: e => { }
        });
    }

    onChangeQuoteLocationOccupancy(quoteLocationOccupancyId) {
        this.router.navigateByUrl(this.appService.routes.quotes.edit(this.quote._id, {
            params: {
                ...this.activatedRoute.snapshot.queryParams,
                ...{ location: quoteLocationOccupancyId }
            }

        }))
    }

}
