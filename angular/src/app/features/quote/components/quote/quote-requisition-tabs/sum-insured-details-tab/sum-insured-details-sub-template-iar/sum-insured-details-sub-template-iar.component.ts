import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { IBscFireLossOfProfitCover } from 'src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model';
import { BscFireLossOfProfitService } from 'src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.service';
import { AllowedLovReferences } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { IMachineryELectricalBreakDownCover } from 'src/app/features/admin/machinery-electrical-breakdown-cover/machinery-electrical-breakdown-cover.model';
import { MachineryElectricalBreakdownCoverService } from 'src/app/features/admin/machinery-electrical-breakdown-cover/machinery-electrical-breakdown-cover.service';
import { IMachineryLossOfProfitCover } from 'src/app/features/admin/machinery-loss-of-profit-cover/machinery-loss-of-profit-cover.model';
import { MachineryLossOfProfitCoverService } from 'src/app/features/admin/machinery-loss-of-profit-cover/machinery-loss-of-profit-cover.service';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
    selector: 'app-sum-insured-details-sub-template-iar',
    templateUrl: './sum-insured-details-sub-template-iar.component.html',
    styleUrls: ['./sum-insured-details-sub-template-iar.component.scss']
})
export class SumInsuredDetailsSubTemplateIarComponent implements OnInit, OnChanges {

    @Input() quote: IQuoteSlip

    @Input() permissions: PermissionType[] = ['read', 'update']


    bscFireLossOfProfit: IBscFireLossOfProfitCover;
    machineryLossOfProfit: IMachineryLossOfProfitCover;
    machineryElectricalBreakdown: IMachineryELectricalBreakDownCover;

    totalMaterialDamageSI = 0
    totalMachineryBreakdownSI = 0

    @Input() quoteOptionData: IQuoteOption     // New_Quote_option

    constructor(
        private formBuilder: FormBuilder,
        private machineryLossOfProfitService: MachineryLossOfProfitCoverService,
        private quoteService: QuoteService,
        private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
        private machineryElectricalBreakdownCoverService: MachineryElectricalBreakdownCoverService
    ) { }

    ngOnChanges(): void {
        // this.ngOnInit()
        this.loadBreakup()
        this.loadMachinery()
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
        this.totalMaterialDamageSI = 0;
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
                this.totalMaterialDamageSI = sum

                // Old_Quote
                // this.bscFireLossOfProfit = this.quote?.locationBasedCovers?.bscFireLossOfProfitCover
                // this.machineryLossOfProfit = this.quote?.locationBasedCovers?.machineryLossOfProfitCover
                // this.machineryElectricalBreakdown = this.quote?.locationBasedCovers?.machineryELectricalBreakDownCover

                // New_Quote_Option
                this.bscFireLossOfProfit = this.quoteOptionData?.locationBasedCovers?.bscFireLossOfProfitCover
                this.machineryLossOfProfit = this.quoteOptionData?.locationBasedCovers?.machineryLossOfProfitCover
                this.machineryElectricalBreakdown = this.quoteOptionData?.locationBasedCovers?.machineryELectricalBreakDownCover
            }
        })
    }

    loadMachinery() {
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
        this.totalMachineryBreakdownSI = 0
        this.machineryElectricalBreakdownCoverService.getMany(lazyLoadEvent).subscribe({
            next: (dto) => {
                // Old_Quote
                // const covers = dto.data.entities.filter((ele) => ele.quoteLocationOccupancyId == this.quote.locationBasedCovers.quoteLocationOccupancy._id);

                // New_Quote_Option
                const covers = dto.data.entities.filter((ele) => ele.quoteLocationOccupancyId == this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy._id);

                for (const cover of covers) {
                    this.totalMachineryBreakdownSI += cover.sumInsurred
                }

                // const breakupsWithOutMachineryBreakdown = breakups.filter((item) => !item.lovReferences.includes(AllowedLovReferences.MACHINERY_BREAKDOWN))

                // const values = breakupsWithOutMachineryBreakdown.map((item) => item.value)

                // const sum = values.reduce((partialSum, a) => partialSum + a, 0);
                // console.log(sum)

                // this.total = sum
            }
        })
    }




    ngOnInit(): void {
        // Old_Quote
        // this.bscFireLossOfProfit = this.quote?.locationBasedCovers?.bscFireLossOfProfitCover
        // this.machineryLossOfProfit = this.quote?.locationBasedCovers?.machineryLossOfProfitCover
        // this.machineryElectricalBreakdown = this.quote?.locationBasedCovers?.machineryELectricalBreakDownCover

        // New_Quote_Option
        this.bscFireLossOfProfit = this.quoteOptionData?.locationBasedCovers?.bscFireLossOfProfitCover
        this.machineryLossOfProfit = this.quoteOptionData?.locationBasedCovers?.machineryLossOfProfitCover
        this.machineryElectricalBreakdown = this.quoteOptionData?.locationBasedCovers?.machineryELectricalBreakDownCover

    }




}
