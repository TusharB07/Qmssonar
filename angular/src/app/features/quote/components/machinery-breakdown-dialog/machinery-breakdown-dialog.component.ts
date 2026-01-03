import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IMachineryResponse, MachineryElectricalBreakdownCoverService } from 'src/app/features/admin/machinery-electrical-breakdown-cover/machinery-electrical-breakdown-cover.service';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';


@Component({
    selector: 'app-machinery-breakdown-dialog',
    templateUrl: './machinery-breakdown-dialog.component.html',
    styleUrls: ['./machinery-breakdown-dialog.component.scss']
})
export class MachineryBreakdownDialogComponent implements OnInit {

    recordForm: FormGroup;
    quote: IQuoteSlip

    quoteOption: IQuoteOption                           // New_Quote_option

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private formBuilder: FormBuilder,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
        private machineryElectricalBreakdownCoverService: MachineryElectricalBreakdownCoverService,
        private quoteService: QuoteService,
        private quoteOptionService: QuoteOptionService,
    ) {
        this.quote = this.config.data.quote

        this.quoteOption = this.config.data.quoteOption

    }

    ngOnInit(): void {

        this.createForm()
        this.loadData()
    }

    loadData() {
        // Old_Quote
        // let lazyLoadEvent: LazyLoadEvent = {
        //     first: 0,
        //     rows: 200,
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
        // }

        this.machineryElectricalBreakdownCoverService.getAllMachinery({
            // Old_Quote
            // quoteId: this.quote._id

            // New_Quote_Option
            quoteOptionId: this.quoteOption._id
        }).subscribe({
            next: (dto) => {
                this.createForm(dto.data.entities)
            }
        })
    }

    createForm(response?: IMachineryResponse[]) {
        this.recordForm = this.formBuilder.group({
            formArray: this.formBuilder.array(

                response?.length > 0 ?
                    response.map((item) => this.createFormRow(item))
                    : []
            )
        });
    }

    get formArray(): FormArray {
        return this.recordForm.get('formArray') as FormArray
    }

    createFormRow(item: IMachineryResponse): FormGroup {

        const form = this.formBuilder.group({
            quoteLocationOccupancyId: [item.quoteLocationOccupancyId],
            locationName: [item.locationName],
            stock: Number([item.stock.toFixed(0)]),
            machineryPercentage: [item.machineryPercentage, [Validators.maxLength(3), Validators.min(0), Validators.max(100)]],
            sumInsured: Number([item.sumInsured.toFixed(0)]),
        })

        form.controls['machineryPercentage'].valueChanges.subscribe({
            next: (value) => {
                let sumInsured = 0;

                sumInsured = form.controls['stock'].value * (form.controls['machineryPercentage'].value / 100)

                form.controls['sumInsured'].setValue(Math.round(sumInsured).toFixed(0))
            }
        })

        return form
    }


    saveRecord() {
        const payload: IMachineryResponse[] = [...this.formArray.value]

        this.machineryElectricalBreakdownCoverService.setAllMachinery({
            // Old_Quote
            // quoteId: this.quote._id,

            // New_Quote_Option
            quoteOptionId: this.quoteOption._id,
            payload: payload
        }).subscribe((dto) => {
            this.ref.close(() => {
                this.quoteService.refresh();
                this.quoteOptionService.refreshQuoteOption()
            })
        })

    }
    cancel() {
        this.ref.close()
    }

}
