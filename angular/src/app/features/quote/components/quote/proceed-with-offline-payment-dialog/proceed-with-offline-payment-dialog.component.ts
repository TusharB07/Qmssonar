import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { IQuoteSlip, OPTIONS_INSTRUMENT_TYPES } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteSlipDialogComponent } from '../../quote-slip-dialog/quote-slip-dialog.component';
import { RiskCoverLetterDialogComponent } from '../../risk-cover-letter-dialog/risk-cover-letter-dialog.component';
import { PaymentDetailsPopupComponent } from '../payment-details-popup/payment-details-popup.component';

@Component({
    selector: 'app-proceed-with-offline-payment-dialog',
    templateUrl: './proceed-with-offline-payment-dialog.component.html',
    styleUrls: ['./proceed-with-offline-payment-dialog.component.scss']
})
export class ProceedWithOfflinePaymentDialogComponent implements OnInit {

    selectedCategory: ILov[];
    instrumentTypes: ILov[];
    offlinePaymentForm: FormGroup;
    submitted: boolean = false;
    constructor(
        private formBuilder: FormBuilder,
        public ref: DynamicDialogRef,
        private dialogService: DialogService,
        private config: DynamicDialogConfig,
        private quoteService: QuoteService,
        private router: Router,

    ) {
        // this.selectedCategory = [
        //     { label: 'Offline', value: 'offline' },
        //     { label: 'Online', value: 'online' },
        // ];

        this.quote = this.config.data.quote;

        this.instrumentTypes = OPTIONS_INSTRUMENT_TYPES
        // this.instrumentTypes = [
        //     { label: 'Cheque', value: 'Cheque' },
        //     { label: 'DD', value: 'DD' },
        //     { label: 'NEFT', value: 'RTGS' },
        // ]
    }

    // paymentType: 'offline' | 'online' = 'offline';

    quote: IQuoteSlip

    ngOnInit(): void {
        this.createForm(this.quote)

        // if (this.quote?.paymentMode && this.quote?.paymentOfflineDraweeBank && this.quote?.paymentOfflineInstrumentTransferCode) {
        //     this.ref.close();
        //     this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/offline-payment`)
        // }
    }
    createForm(quote?) {// insert the mode behind the 'item'

        this.offlinePaymentForm = this.formBuilder.group({
            paymentMode: ['offline', [Validators.required]],
            // paymentOfflineDraweeBank: [quote?.paymentOfflineDraweeBank, [Validators.required, Validators.min(0)]],
            // paymentOfflineInstrumentTransferCode: [quote?.paymentOfflineInstrumentTransferCode, [Validators.required, Validators.min(0)]],
            instrumentType: [quote?.instrumentType, [Validators.required]],
            chequeNo: [quote?.chequeNo, [Validators.required]],
            bankName: [quote?.bankName, [Validators.required]],
            branchName: [quote?.branchName, [Validators.required]],
            ifscCode: [quote?.ifscCode, [Validators.required]],
            paymentOperationAssignAt: [quote?.paymentOperationAssignAt, [Validators.required]],
            // instrumentTransferAmount: [quote?.totalIndictiveQuoteAmt, [Validators.required, Validators.min(0)]]
        })

        // this.offlinePaymentForm.controls['paymentMode'].valueChanges.subscribe(value => {
        //     this.paymentType = value;
        // })
    }



    cancel() {
        this.ref.close();
    }

    submitOfflinePaymentForm() {


        if (this.offlinePaymentForm.valid) {

            const payload = { ...this.offlinePaymentForm.value };
            // updatePayload["stateId"] = this.editInsuredDetailsForm.value["stateId"].value;

            this.quoteService.update(this.quote._id, payload).subscribe({
                next: (dto) => {

                    this.ref.close()
                    const ref = this.dialogService.open(PaymentDetailsPopupComponent, {
                        // width: '500px',
                        header: 'Payment Details Confirmed',
                        styleClass: 'flatPopup',
                        data: {
                            quote: dto.data.entity.placedIcQuoteId,
                        }
                    })

                    // this.router.navigateByUrl(`/`);
                    // this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/offline-payment`)
                }
            })



            // this.quoteService.update(this.quote._id, updatePayload).subscribe({
            //   next: partner => {
            //   //   this.router.navigateByUrl(`${this.modulePath}`);
            //   this.ref.close();


            // }});

            // console.log(this.quote)


            this.ref.close();

        }



    }

    viewQuote() {

        const ref = this.dialogService.open(QuoteSlipDialogComponent, {
            header: this.quote.quoteNo,
            width: '1200px',
            styleClass: 'customPopup customPopup-dark',
            data: {
                quote: this.quote,
            }
        })
    }
}


