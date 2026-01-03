import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ProceedWithOfflinePaymentDialogComponent } from '../quote/proceed-with-offline-payment-dialog/proceed-with-offline-payment-dialog.component';

interface Premium {
    sectionOrCover: string,
    sumInsured: Number,
    netPremium: Number,
    gst: Number,
    totalPremium: Number,
}



@Component({
    selector: 'app-quote-slip-dialog',
    templateUrl: './quote-slip-dialog.component.html',
    styleUrls: ['./quote-slip-dialog.component.scss']
})

export class QuoteSlipDialogComponent implements OnInit {

    quote: IQuoteSlip
    private currentQuote: Subscription;

    isPendingPayment: boolean;
    pendingStatus: boolean;
    paymentPandingStatus: boolean;
    currentUser$: Observable<IUser>;

    quoteOption: IQuoteOption

    constructor(
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private quoteService: QuoteService,
        private dialogService: DialogService,
        private accountService: AccountService

    ) {

        // this.currentQuote = this.quoteService.currentQuote$.subscribe({
        //     next: (quote: IQuoteSlip) => {
        //         this.quote = quote
        //     }
        // })

        // Old_Quote
        this.quote = this.config.data.quote;
        this.currentUser$ = this.accountService.currentUser$

        // New_Quote_option
        this.quoteOption = this.config?.data?.quoteOption;
    }

    ngOnInit() {

        if (this.quote?.quoteState === "Pending Payment") {
            return this.pendingStatus = true
        } else {

            return this.paymentPandingStatus = true
        }
    }

    proceedToPayment() {
        // this.ref.close()
        this.openPendingPaymentDialog(this.quote)
    }

    ngOnDestroy(): void {
        // this.currentQuote.unsubscribe();
    }

    openPendingPaymentDialog(quote: IQuoteSlip) {
        const ref = this.dialogService.open(ProceedWithOfflinePaymentDialogComponent, {
            width: '550px',
            styleClass: 'flatPopup',
            data: {
                quote: quote,
            }
        })


    }

}
