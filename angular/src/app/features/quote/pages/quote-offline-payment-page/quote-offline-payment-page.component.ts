import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { PaymentCompletedSuccessfullyDialogComponent } from '../../components/payment-completed-successfully-dialog/payment-completed-successfully-dialog.component';
import { RiskCoverLetterDialogComponent } from '../../components/risk-cover-letter-dialog/risk-cover-letter-dialog.component';

@Component({
    selector: 'app-quote-offline-payment-page',
    templateUrl: './quote-offline-payment-page.component.html',
    styleUrls: ['./quote-offline-payment-page.component.scss']
})
export class QuoteOfflinePaymentPageComponent implements OnInit {


    id: string;
    quote: IQuoteSlip;

    private currentQuote: Subscription;



    constructor(
        private quoteService: QuoteService,
        private activatedRoute: ActivatedRoute,
        private dialogService: DialogService,
        private router: Router,

    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {

                this.quote = quote


                if (quote?.paymentOfflineReceivedAt) {
                    this.router.navigateByUrl(`/`);
                }
            }
        })
    }

    ngOnInit(): void {
        this.quoteService.get(this.id, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // console.log(dto.data.entity)
                this.quoteService.setQuote(dto.data.entity)
            },
            error: e => {
                console.log(e);
            }
        });

    }

    paymentReceived() {
        let now = new Date();

        this.quoteService.update(this.quote._id, { paymentOfflineReceivedAt: now }).subscribe({
            next: (dto) => {
                this.quoteService.sendQuoteForPlacement(this.quote._id).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {

                        const ref = this.dialogService.open(PaymentCompletedSuccessfullyDialogComponent, {
                            header: '',
                            width: '800px',
                            styleClass: 'flatPopup',
                            data: {
                                quote: dto.data.entity
                            }
                        });

                        ref.onClose.subscribe((isNavigate = true) => {
                            if(isNavigate)
                            this.router.navigateByUrl(`/`);
                        })

                    }
                })
            }
        });
    }

}
