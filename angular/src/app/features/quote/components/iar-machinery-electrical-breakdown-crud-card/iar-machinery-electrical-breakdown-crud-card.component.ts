import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AllowedLovReferences } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { IMachineryELectricalBreakDownCover } from 'src/app/features/admin/machinery-electrical-breakdown-cover/machinery-electrical-breakdown-cover.model';
import { MachineryElectricalBreakdownCoverService } from 'src/app/features/admin/machinery-electrical-breakdown-cover/machinery-electrical-breakdown-cover.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { MachineryBreakdownDialogComponent } from '../machinery-breakdown-dialog/machinery-breakdown-dialog.component';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-iar-machinery-electrical-breakdown-crud-card',
    templateUrl: './iar-machinery-electrical-breakdown-crud-card.component.html',
    styleUrls: ['./iar-machinery-electrical-breakdown-crud-card.component.scss']
})
export class IarMachineryElectricalBreakdownCrudCardComponent implements OnInit, OnChanges {

    @Input() quote: IQuoteSlip

    @Input() permissions: PermissionType[] = ['read']

    machineryElectricalBreakdownForm: FormGroup;

    machineryElectricalBreakdown: IMachineryELectricalBreakDownCover;

    totalSI = 0
    totalStock = 0

    totalPermium = 0

    @Input() quoteOptionData: IQuoteOption     // New_Quote_option

    constructor(
        // public ref: DynamicDialogRef,
        private formBuilder: FormBuilder,
        private machineryElectricalBreakdownCoverService: MachineryElectricalBreakdownCoverService,
        private dialogService: DialogService,
        private quoteService: QuoteService,
        private quoteOptionService: QuoteOptionService,

    ) {
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        // Old_Quote
        // this.machineryElectricalBreakdown = this.quote?.locationBasedCovers?.machineryELectricalBreakDownCover

        // New_Quote_Option
        this.machineryElectricalBreakdown = this.quoteOptionData?.locationBasedCovers?.machineryELectricalBreakDownCover

        this.createMachineryElectricalBreakdownCoverForm(this.machineryElectricalBreakdown)

        this.loadMachinery()
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

        this.machineryElectricalBreakdownCoverService.getMany(lazyLoadEvent).subscribe({
            next: (dto) => {
                this.totalSI = 0;
                this.totalStock = 0;
                this.totalPermium = 0;

                // Old_Quote
                // const covers = dto.data.entities.filter((ele) => ele.quoteLocationOccupancyId == this.quote.locationBasedCovers.quoteLocationOccupancy._id)

                // New_Quote_Option
                const covers = dto.data.entities.filter((ele) => ele.quoteLocationOccupancyId == this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy._id)


                for (const cover of covers) {
                    this.totalSI += cover.sumInsurred
                    this.totalStock += cover.stock
                    this.totalPermium += cover.total
                }
            }
        })
    }

    // ----------------------------------------------------------------------------------------

    createMachineryElectricalBreakdownCoverForm(item?: IMachineryELectricalBreakDownCover) {
        // Old_Quote
        // const stockFromBreakup = this.quote?.locationBasedCovers?.lovReferences?.find((item) => item.lovReference == AllowedLovReferences.MACHINERY_BREAKDOWN)

        // New_Quote_Option
        const stockFromBreakup = this.quoteOptionData?.locationBasedCovers?.lovReferences?.find((item) => item.lovReference == AllowedLovReferences.MACHINERY_BREAKDOWN)


        const machineryPercentage = item?.machineryPercentage ?? 100

        const stock: number = item?.stock ?? stockFromBreakup?.lovValue ?? 0

        const sumInsurred: number = stock * (machineryPercentage / 100)


        this.machineryElectricalBreakdownForm = this.formBuilder.group({
            machineryPercentage: [machineryPercentage, [Validators.required, Validators.min(0), Validators.max(100)]],
            stock: [stock, [Validators.required, Validators.min(0)]],

            sumInsurred: [sumInsurred, [Validators.required, Validators.min(0)]],
        })

        this.machineryElectricalBreakdownForm.controls['machineryPercentage'].valueChanges.subscribe({
            next: (value) => {
                let stock: number = this.machineryElectricalBreakdownForm.controls['stock'].value

                let sumInsurred: number = stock * (value / 100)

                this.machineryElectricalBreakdownForm.controls['sumInsurred'].setValue(sumInsurred)
            }
        })
    }

    openMachineryBreakDown() {
        const ref = this.dialogService.open(MachineryBreakdownDialogComponent, {
            header: "View All Machinery Breakdown",
            data: {
                quote: this.quote,
                // New_Quote_Option
                quoteOption: this.quoteOptionData,
            },
            width: '50%',
            // height: '50%',
            styleClass: "customPopup"
        })
        ref.onClose.subscribe({
            next: () => {
                this.quoteService.refresh()
                this.quoteOptionService.refreshQuoteOption()

            }
        })
    }

    submitMachineryElectricalBreakdownCover() {
        if (this.machineryElectricalBreakdownForm.valid) {
            if (this.machineryElectricalBreakdown?._id) {

                const payload = { ...this.machineryElectricalBreakdownForm.value }

                this.machineryElectricalBreakdownCoverService.update(this.machineryElectricalBreakdown?._id, payload).subscribe({
                    next: (response: IOneResponseDto<IMachineryELectricalBreakDownCover>) => {

                        // console.log(response.data.entity)
                        this.machineryElectricalBreakdown = response.data.entity
                        this.machineryElectricalBreakdownForm.markAsPristine();
                        this.machineryElectricalBreakdownForm.markAsUntouched();
                        this.quoteService.refresh()
                        this.quoteOptionService.refreshQuoteOption()

                    },
                    error: error => {
                        console.log(error);
                    }
                });


            } else {
                const payload = { ...this.machineryElectricalBreakdownForm.value }

                payload['quoteId'] = this.quote._id;
                // Old_Quote
                // payload['quoteLocationOccupancyId'] = this.quote.locationBasedCovers.quoteLocationOccupancy._id;

                // New_Quote_Option
                payload['quoteOptionId'] = this.quoteOptionData._id;                            
                payload['quoteLocationOccupancyId'] = this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy._id;

                this.machineryElectricalBreakdownCoverService.create(payload).subscribe({
                    next: (response: IOneResponseDto<IMachineryELectricalBreakDownCover>) => {

                        this.machineryElectricalBreakdown = response.data.entity
                        this.machineryElectricalBreakdownForm.markAsPristine();
                        this.machineryElectricalBreakdownForm.markAsUntouched();

                        // this.ref.close(this.bscFireLossOfProfit);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        }
    }

}
