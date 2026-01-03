import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';

@Component({
    selector: 'app-payment-details-popup',
    templateUrl: './payment-details-popup.component.html',
    styleUrls: ['./payment-details-popup.component.scss']
})
export class PaymentDetailsPopupComponent implements OnInit {

    quote: IQuoteSlip

    constructor(
        private config: DynamicDialogConfig,
        private ref: DynamicDialogRef,
        private router: Router
    ) {
        this.quote = this.config.data.quote
    }

    ngOnInit(): void {
    }

    close() {
        
        this.router.navigateByUrl('/')
        this.ref.close()
    }
}
