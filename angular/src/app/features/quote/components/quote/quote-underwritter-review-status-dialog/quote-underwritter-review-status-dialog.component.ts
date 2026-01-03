import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
    selector: 'app-quote-underwritter-review-status-dialog',
    templateUrl: './quote-underwritter-review-status-dialog.component.html',
    styleUrls: ['./quote-underwritter-review-status-dialog.component.scss']
})
export class QuoteUnderwritterReviewStatusDialogComponent implements OnInit {

    tasks = [];


    quote: IQuoteSlip

    private currentQuote: Subscription;


    constructor(
        private quoteService: QuoteService,
    ) {
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
            }
        })

    }

    ngOnInit(): void {

        for (let i = 1; i <= 10; i++) {
            console.log()

            const underWriter: IUser = this.quote[`underWriter${i}`] as IUser;
            const underWriterStage: String = this.quote[`underWriter${i}Stage`];

            if (underWriter) {
                this.tasks.push({ "status": underWriterStage, "userName": `${underWriter.name}`, "role": `Level ${underWriter.underWriterLevel}`, "statusText": underWriterStage.replace(/_/g, " ") })
            }
        }

        console.log(this.quote)

    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }


}
