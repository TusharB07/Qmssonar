import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AllowedQuoteStates, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ChoosePaymentModeDialogComponent } from '../../components/quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';

@Component({
    selector: 'app-non-otc-quote-sent-to-insurer-dialog',
    templateUrl: './non-otc-quote-sent-to-insurer-dialog.component.html',
    styleUrls: ['./non-otc-quote-sent-to-insurer-dialog.component.scss']
})
export class NonOtcQuoteSentToInsurerDialogComponent implements OnInit {

    constructor(
        private ref: DynamicDialogRef

    ) {

    }

    ngOnInit(): void {

    }

    goToDashboard() {
        this.ref.close();
    }

}
