import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { generate, Subscription } from 'rxjs';
import { IBulkImportResponseDto, ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteSlipDialogComponent } from '../../components/quote-slip-dialog/quote-slip-dialog.component';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-quote-comparision-review-page',
    templateUrl: './quote-comparision-review-page.component.html',
    styleUrls: ['./quote-comparision-review-page.component.scss']
})
export class QuoteComparisionReviewPageComponent implements OnInit {

    id: string;
    quote: IQuoteSlip;

    insurerProcessedQuotes: IQuoteSlip[]

    private currentQuote: Subscription;

    selectedQuoteLocationOccpancyId: string;
    optionsQuoteLocationOccupancies: ILov[];

    constructor(

        private router: Router,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private dialogService: DialogService,
        private appService: AppService,
    ) {



        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote

                this.insurerProcessedQuotes = quote?.insurerProcessedQuotes;

            }
        })
    }
    ngOnInit() {
        this.quoteService.get(`${this.id}`, { allCovers: true, qcr: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                console.log(dto.data.entity)
                this.quoteService.setQuote(dto.data.entity)
            },
            error: e => {
                console.log(e);
            }
        });

        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteId: [
                    {
                        value: this.id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        // console.log(event)

        this.quoteLocationOccupancyService.getManyAsLovs({}, lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
                // console.log(dto.data.entities)
                // console.log(data)
                this.optionsQuoteLocationOccupancies = dto.data.entities.map((entity: IQuoteLocationOccupancy) => {
                    let clientLocation: IClientLocation = entity.clientLocationId as IClientLocation
                    return { label: `${entity.locationName}`, value: entity._id }
                });

                // this.quoteService.setQuoteLocationOccupancyId(this.optionsQuoteLocationOccupancies[0]?.value);
                this.loadData(this.optionsQuoteLocationOccupancies[0]?.value);
            },
            error: e => { }
        });
    }

    ngOnDestroy(): void {
        // this.currentQuoteLocationOccupancyId.unsubscribe();
        this.currentQuote.unsubscribe();
    }

    loadData(quoteLocationOccupancyId: string) {
        this.quoteService.setQuoteLocationOccupancyId(quoteLocationOccupancyId)
    }

    quotefromgeneralinsurance() {
        this.router.navigateByUrl(`backend/quotes/${this.quote._id}/placement`)


    }


    openQuoteslipDialog(quote) {
        console.log('insurer quote', quote)
        const ref = this.dialogService.open(QuoteSlipDialogComponent, {
            header: this.quote.quoteNo,
            width: '1200px',
            styleClass: 'customPopup-dark',
            data: {
                quote: quote,
            }
        })

        // ref.onClose.subscribe(() => {
        //     this.router.navigateByUrl(`/`);
        // })

    }
    generatePlacementSlip(quote) {
        this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${quote._id}`)
        // this.router.navigate()
    }
}
