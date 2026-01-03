import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { ChoosePaymentModeDialogComponent } from '../quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { ProceedWithOfflinePaymentDialogComponent } from '../quote/proceed-with-offline-payment-dialog/proceed-with-offline-payment-dialog.component';

@Component({
    selector: 'app-proposal-verified-dialog',
    templateUrl: './proposal-verified-dialog.component.html',
    styleUrls: ['./proposal-verified-dialog.component.scss']
})
export class ProposalVerifiedDialogComponent implements OnInit {
    quote: IQuoteSlip;
    id: string;
    isCKYCTemplate: boolean = false;

    constructor(
        private dialogService: DialogService,
        private activatedRoute: ActivatedRoute,
        public ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

        this.quote = this.config.data.quote;
        this.isCKYCTemplate = this.config.data.isCKYCTemplate
    }

    ngOnInit(): void {

    }

    openChoosePaymentMethod() {
        const ref = this.dialogService.open(ChoosePaymentModeDialogComponent, {
            // header: 'Choose Payment Method',
            header: 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,
            data: {
                quote: this.quote,
            },
            width: '400px',
            // height: '40%',
            styleClass: "customPopup "
        })
        this.ref.close();
    }

    close() {
        this.ref.close();
        if (this.isCKYCTemplate) {
            const ref = this.dialogService.open(ChoosePaymentModeDialogComponent, {
                // header: 'Choose Payment Method',
                header: 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,
                data: {
                    quote: this.quote,
                },
                width: '45%',
                // height: '40%',
                styleClass: "customPopup "
            })
        }
        else {
            this.openOfflinePaymentDialog();
        }

    }
    openOfflinePaymentDialog() {
        this.ref.close();

        const ref = this.dialogService.open(ProceedWithOfflinePaymentDialogComponent, {
            header: 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,

            data: {
                quote: this.quote,
            },
            width: '45%',
            // height: '40%',
            styleClass: "customPopup "
        })

    }
}
