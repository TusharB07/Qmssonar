import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PFileUploadGetterProps } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ChoosePaymentModeDialogComponent } from '../quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { ProceedWithOfflinePaymentDialogComponent } from '../quote/proceed-with-offline-payment-dialog/proceed-with-offline-payment-dialog.component';

@Component({
    selector: 'app-upload-proposal-form-dialog',
    templateUrl: './upload-proposal-form-dialog.component.html',
    styleUrls: ['./upload-proposal-form-dialog.component.scss']
})
export class UploadProposalFormDialogComponent implements OnInit {

    quote: IQuoteSlip

    uploadHttpHeaders: HttpHeaders;
    isCKYCTemplate: boolean = false;

    constructor(
        public ref: DynamicDialogRef,
        private dialogService: DialogService,
        public config: DynamicDialogConfig,
        private quoteService: QuoteService,
        private messageService: MessageService,
        private accountService: AccountService,

    ) {

        this.quote = this.config.data.quote
        this.isCKYCTemplate = this.config.data.isCKYCTemplate

        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    }

    get uploadProposalForm(): PFileUploadGetterProps {
        return {
            name: "proposalForm",
            url: this.quoteService.uploadProposalFormUrl(this.quote._id),
            accept: 'application/pdf',
            maxFileSize: 1000000,
            method: 'post',
            onUpload: ($event) => {
                this.messageService.add({
                    detail: 'Propsoal Form Uploaded',
                    severity: 'success'
                })
                this.quoteService.refresh()
            }

        }
    }

    onProceed(){
        this.ref.close();
        if(this.isCKYCTemplate){
            const ref = this.dialogService.open(ChoosePaymentModeDialogComponent, {
                // header: 'Choose Payment Method',
                header: 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,
                data: {
                    quote: this.quote,
                    isCKYCTemplate: this.isCKYCTemplate
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

    ngOnInit(): void {
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
