import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { IMachineryLossOfProfitCover } from 'src/app/features/admin/machinery-loss-of-profit-cover/machinery-loss-of-profit-cover.model';
import { MachineryLossOfProfitCoverService } from 'src/app/features/admin/machinery-loss-of-profit-cover/machinery-loss-of-profit-cover.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-iar-machinery-loss-of-profit-crud-card',
    templateUrl: './iar-machinery-loss-of-profit-crud-card.component.html',
    styleUrls: ['./iar-machinery-loss-of-profit-crud-card.component.scss']
})
export class IarMachineryLossOfProfitCrudCardComponent implements OnInit {

    @Input() quote: IQuoteSlip

    @Input() permissions: PermissionType[] = ['read']

    machineryLossOfProfitForm: FormGroup;

    optionsIndmenityPeriod: ILov[];

    machineryLossOfProfit: IMachineryLossOfProfitCover;
    submitted: boolean = false;

    @Input() quoteOptionData: IQuoteOption     // New_Quote_option

    constructor(
        private formBuilder: FormBuilder,
        private machineryLossOfProfitService: MachineryLossOfProfitCoverService,
        private quoteService: QuoteService,
        private quoteOptionService: QuoteOptionService,

    ) {
        this.optionsIndmenityPeriod = [
            { label: '03 Months', value: '03 Months' },
            { label: '06 Months', value: '06 Months' },
            { label: '09 Months', value: '09 Months' },
            { label: '12 Months', value: '12 Months' },
            { label: '18 Months', value: '18 Months' },
            { label: '24 Months', value: '24 Months' },
            { label: '30 Months', value: '30 Months' },
            { label: '36 Months', value: '36 Months' },
            { label: '42 Months', value: '42 Months' },
            { label: '48 Months', value: '48 Months' },
        ];
    }

    ngOnInit(): void {
        // Old_Quote
        // this.machineryLossOfProfit = this.quote?.locationBasedCovers?.machineryLossOfProfitCover

        // New_Quote_Option
        this.machineryLossOfProfit = this.quoteOptionData?.locationBasedCovers?.machineryLossOfProfitCover

        this.createMachineryLossOfProfitCoverForm(this.machineryLossOfProfit)


    }

    ngOnChanges(changes: SimpleChanges): void {
        // Old_Quote
        // this.machineryLossOfProfit = this.quote?.locationBasedCovers?.machineryLossOfProfitCover

        // New_Quote_Option
        this.machineryLossOfProfit = this.quoteOptionData?.locationBasedCovers?.machineryLossOfProfitCover

        this.createMachineryLossOfProfitCoverForm(this.machineryLossOfProfit)


    }

    createMachineryLossOfProfitCoverForm(item?: IMachineryLossOfProfitCover) {
        this.machineryLossOfProfitForm = this.formBuilder.group({
            grossProfit: [item?.grossProfit ?? 0, [Validators.required, Validators.min(1)]],
            indmenityPeriod: [item?.indmenityPeriod ?? '12 Months', [Validators.required]],
            // Old_Quote
            // terrorism: [this.quote?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism, [Validators.required,]],
            // New_Quote_Option
            terrorism: [this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism],
        })
        if (!!item?.grossProfit) {
            this.machineryLossOfProfitForm.controls['grossProfit'].disable()
        } else {
            this.machineryLossOfProfitForm.controls['grossProfit'].enable()
        }
        this.machineryLossOfProfitForm.controls['grossProfit'].updateValueAndValidity();
    }

    submitMachineryLossOfProfitCover() {
        if (this.machineryLossOfProfitForm.valid) {
            if (this.machineryLossOfProfit?._id) {
                const payload = { ...this.machineryLossOfProfitForm.value }
                payload['grossProfit'] = this.machineryLossOfProfitForm.get('grossProfit').value;

                this.machineryLossOfProfitService.update(this.machineryLossOfProfit?._id, payload).subscribe({
                    next: (response: IOneResponseDto<IMachineryLossOfProfitCover>) => {

                        this.machineryLossOfProfit = response.data.entity
                        this.machineryLossOfProfitForm.markAsPristine();
                        this.machineryLossOfProfitForm.markAsUntouched();

                        this.quoteService.refresh()
                        this.quoteOptionService.refreshQuoteOption()
                    },
                    error: error => {
                        console.log(error);
                    }
                });


            } else {
                const payload = { ...this.machineryLossOfProfitForm.value }

                payload['quoteId'] = this.quote._id;
                payload['quoteOptionId'] = this.quoteOptionData._id;

                this.machineryLossOfProfitService.create(payload).subscribe({
                    next: (response: IOneResponseDto<IMachineryLossOfProfitCover>) => {

                        this.machineryLossOfProfit = response.data.entity
                        this.machineryLossOfProfitForm.markAsPristine();
                        this.machineryLossOfProfitForm.markAsUntouched();

                        this.quoteService.refresh()
                        this.quoteOptionService.refreshQuoteOption()

                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        }
    }


}
