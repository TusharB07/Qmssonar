import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { RiskCoverLetterDialogComponent } from '../risk-cover-letter-dialog/risk-cover-letter-dialog.component';

@Component({
    selector: 'app-payment-completed-successfully-dialog',
    templateUrl: './payment-completed-successfully-dialog.component.html',
    styleUrls: ['./payment-completed-successfully-dialog.component.scss']
})
export class PaymentCompletedSuccessfullyDialogComponent implements OnInit {

    quote: IQuoteSlip

    constructor(
        private ref: DynamicDialogRef,
        private router: Router,
        private dialogService: DialogService,
        private config: DynamicDialogConfig,
    ) {
        this.quote = this.config.data.quote
    }

    ngOnInit(): void {
    }


    close() {
        this.ref.close();
        // this.router.navigateByUrl('/')
    }

    viewRiskLetterHead() {
        this.ref.close();
        const ref = this.dialogService.open(RiskCoverLetterDialogComponent, {
            header: '',
            // width: '800px',
            styleClass: 'flatPopup',
            data: {
                quote: this.quote
            }
        });

        // ref.onClose.subscribe(() => {
        //     this.router.navigateByUrl(`/`);
        // })
    }
}
