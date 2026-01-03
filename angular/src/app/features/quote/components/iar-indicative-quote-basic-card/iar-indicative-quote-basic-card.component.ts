import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { IOneResponseDto } from 'src/app/app.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteLocationBreakupDialogComponent } from '../quote-location-breakup-dialog/quote-location-breakup-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { Subscription } from 'rxjs';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { LazyLoadEvent } from 'primeng/api';
import { AllowedLovReferences } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';

@Component({
    selector: 'app-iar-indicative-quote-basic-card',
    templateUrl: './iar-indicative-quote-basic-card.component.html',
    styleUrls: ['./iar-indicative-quote-basic-card.component.scss']
})
export class IarIndicativeQuoteBasicCardComponent implements OnInit {


    @Input() quote: IQuoteSlip;


    AllowedProductTemplate = AllowedProductTemplate

    @Input() isShowBreakupType: boolean

    totalPremium = 0;
    basePremium = 0;
    sumInsured = 0;

    total = 0;

    toWord = new ToWords();

    @Input() quoteOptionData: IQuoteOption     // New_Quote_option

    constructor(
        private dialogService: DialogService,
        private quoteService: QuoteService,
        private quoteLocationBreakupService: QuoteLocationBreakupMasterService,

    ) {

    }

    ngOnInit(): void {

        // Old_Quote
        // this.totalPremium = this.quote?.totalIndictiveQuoteAmt
        // this.basePremium = Number(this.quote?.totalFlexa) + Number(this.quote?.totalStfi) + Number(this.quote?.totalEarthquake) + Number(this.quote?.totalTerrorism)

        // this.sumInsured = this.quote?.totalSumAssured

        // New_Quote_Option
        this.totalPremium = this.quoteOptionData?.totalIndictiveQuoteAmt
        this.basePremium = Number(this.quoteOptionData?.totalFlexa) + Number(this.quoteOptionData?.totalStfi) + Number(this.quoteOptionData?.totalEarthquake) + Number(this.quoteOptionData?.totalTerrorism)

        this.sumInsured = this.quoteOptionData?.totalSumAssured

        this.loadBreakup()
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Old_Quote
        // this.totalPremium = this.quote?.totalIndictiveQuoteAmt
        // this.basePremium = Number(this.quote?.totalFlexa) + Number(this.quote?.totalStfi) + Number(this.quote?.totalEarthquake) + Number(this.quote?.totalTerrorism)

        // this.sumInsured = this.quote?.totalSumAssured

        // New_Quote_Option
        this.totalPremium = this.quoteOptionData?.totalIndictiveQuoteAmt
        this.basePremium = Number(this.quoteOptionData?.totalFlexa) + Number(this.quoteOptionData?.totalStfi) + Number(this.quoteOptionData?.totalEarthquake) + Number(this.quoteOptionData?.totalTerrorism)

        this.sumInsured = this.quoteOptionData?.totalSumAssured

        this.loadBreakup()
    }




    loadBreakup() {
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
        this.quoteLocationBreakupService.getMany(lazyLoadEvent).subscribe({
            next: (dto) => {

                const breakups = dto.data.entities
                // Old_Quote
                // const breakupsWithOutMachineryBreakdown = breakups.filter((item) => item.lovReferences.includes(AllowedLovReferences.PROPERTY_DAMAGE)).filter((ele) => ele.quoteLocationOccupancyId == this.quote.locationBasedCovers.quoteLocationOccupancy._id);

                // New_Quote_Option
                const breakupsWithOutMachineryBreakdown = breakups.filter((item) => item.lovReferences.includes(AllowedLovReferences.PROPERTY_DAMAGE)).filter((ele) => ele.quoteLocationOccupancyId["_id"] == this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy._id);
                const values = breakupsWithOutMachineryBreakdown.map((item) => item.value)
                let temp = 0
                values.map((item) => {
                    if (typeof (item) == 'number') {
                        temp += item
                    }
                });
                const sum = temp
                this.total = sum
            }
        })
    }

    openSumInsuredSplitDialog() {

        const ref = this.dialogService.open(QuoteLocationBreakupDialogComponent, {
            header: "Edit Sum Insured Split",
            data: {
                quote: this.quote,
                // selectedLocation: this.quote.locationBasedCovers.quoteLocationOccupancy

                // New_Quote_Option
                quoteOptionData: this.quoteOptionData,
                selectedLocation: this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy
            },
            width: '1200px',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe(() => {
            // if (bscMoneySafeTillCover) this.bscMoneySafeTillCover = bscMoneySafeTillCover;
            this.loadBreakup();
        });
    }

    ngOnDestroy(): void {

    }

}
