import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { IQuoteLocationOccupancy } from '../../admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from '../../admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteSlip } from '../../admin/quote/quote.model';
import { QuoteService } from '../../admin/quote/quote.service';

@Component({
    selector: 'app-indicative-quote-view-details-dialog',
    templateUrl: './indicative-quote-view-details-dialog.component.html',
    styleUrls: ['./indicative-quote-view-details-dialog.component.scss']
})
export class IndicativeQuoteViewDetailsDialogComponent implements OnInit {

    id: string;
    quote: IQuoteSlip;


    optionsQuoteLocationOccupancies: ILov[];
    selectedQuoteLocationOccpancy: ILov;


    responsiveOptions;

    visibleSidebar1;


    isFlexa = false;
    isStfi = false;
    isEarthquake = false;
    isTerrorism = false;

    quoteLocationOccupancy: IQuoteLocationOccupancy;

    locationBasedCovers: any;

    progressValue = 0;

    tabIndex: number = 0;



    constructor(

        public config: DynamicDialogConfig,
        private dialogService: DialogService,
        private messageService: MessageService,
        private primengConfig: PrimeNGConfig,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private router: Router,


    ) {
        this.id = this.config.data.quote_id
        // console.log(config.data.quote_id);

        // this.searchOptionsQuoteLocationOccpancies();
    }

    ngOnInit(): void {
        // console.log(this.config.data.quote_id);
        // console.log(this.config.data.clientLocationId.id);

        this.quoteService.get(this.id, {
            allCovers: true
        }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.quote = dto.data.entity;
                // console.log('Quote',this.quote)
            },
            error: e => {
                console.log(e);
            }

        });


    }


}
