import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { IBscFireLossOfProfitCover } from 'src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model';
import { BscFireLossOfProfitService } from 'src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-iar-fire-loss-of-profit-crud-card',
    templateUrl: './iar-fire-loss-of-profit-crud-card.component.html',
    styleUrls: ['./iar-fire-loss-of-profit-crud-card.component.scss']
})
export class IarFireLossOfProfitCrudCardComponent implements OnInit {

    @Input() quote: IQuoteSlip

    @Input() permissions: PermissionType[] = ['read']

    bscFireLossOfProfit: IBscFireLossOfProfitCover;

    fireLossOfProfitForm: FormGroup;

    optionsIndmenityPeriod: ILov[];
    submitted: boolean = false;

    @Input() quoteOptionData: IQuoteOption     // New_Quote_option

    constructor(
        private formBuilder: FormBuilder,
        private bscFireLossOfProfitService: BscFireLossOfProfitService,
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
        // this.bscFireLossOfProfit = this.quote?.locationBasedCovers?.bscFireLossOfProfitCover

        // New_Quote_Option
        this.bscFireLossOfProfit = this.quoteOptionData?.locationBasedCovers?.bscFireLossOfProfitCover

        this.createFireLossOfProfitForm(this.bscFireLossOfProfit)

    }

    ngOnChanges(changes: SimpleChanges): void {

        // Old_Quote
        // this.bscFireLossOfProfit = this.quote?.locationBasedCovers?.bscFireLossOfProfitCover

        // New_Quote_Option
        this.bscFireLossOfProfit = this.quoteOptionData?.locationBasedCovers?.bscFireLossOfProfitCover

        this.createFireLossOfProfitForm(this.bscFireLossOfProfit)
    }

    createFireLossOfProfitForm(item?: IBscFireLossOfProfitCover) {

        this.fireLossOfProfitForm = this.formBuilder.group({
            grossProfit: [item?.grossProfit ?? 0, [Validators.required, Validators.min(1)]],
            indmenityPeriod: [item?.indmenityPeriod ?? '12 Months', [Validators.required]],
            auditorsFees: [0],
            // Old_Quote
            // terrorism: [this.quote?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism, [Validators.required,]],
            // New_Quote_Option
            terrorism: [this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism],
        })
        if (!!item?.grossProfit) {
            this.fireLossOfProfitForm.controls['grossProfit'].disable()
        } else {
            this.fireLossOfProfitForm.controls['grossProfit'].enable()
        }
        this.fireLossOfProfitForm.controls['grossProfit'].updateValueAndValidity();
    }

    submitFireLossOfProfit() {
        if (this.fireLossOfProfitForm.valid) {
            if (this.bscFireLossOfProfit?._id) {
                const payload = { ...this.fireLossOfProfitForm.value, quoteId: this.quote?._id, quoteOptionId: this.quoteOptionData?._id }
                payload['grossProfit'] = this.fireLossOfProfitForm.get('grossProfit').value;

                this.bscFireLossOfProfitService.update(this.bscFireLossOfProfit?._id, payload).subscribe({
                    next: (response: IOneResponseDto<IBscFireLossOfProfitCover>) => {

                        this.bscFireLossOfProfit = response.data.entity
                        this.fireLossOfProfitForm.markAsPristine();
                        this.fireLossOfProfitForm.markAsUntouched();

                        this.quoteService.refresh()
                        this.quoteOptionService.refreshQuoteOption()
                    },
                    error: error => {
                        console.log(error);
                    }
                });


            } else {
                const payload = { ...this.fireLossOfProfitForm.value }

                payload['quoteId'] = this.quote._id;
                payload['quoteOptionId'] = this.quoteOptionData._id;

                this.bscFireLossOfProfitService.create(payload).subscribe({
                    next: (response: IOneResponseDto<IBscFireLossOfProfitCover>) => {

                        this.bscFireLossOfProfit = response.data.entity
                        this.fireLossOfProfitForm.markAsPristine();
                        this.fireLossOfProfitForm.markAsUntouched();

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
