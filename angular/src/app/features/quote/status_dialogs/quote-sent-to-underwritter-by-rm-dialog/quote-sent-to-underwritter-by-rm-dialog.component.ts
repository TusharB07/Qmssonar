import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
    selector: 'app-quote-sent-to-underwritter-by-rm-dialog',
    templateUrl: './quote-sent-to-underwritter-by-rm-dialog.component.html',
    styleUrls: ['./quote-sent-to-underwritter-by-rm-dialog.component.scss']
})
export class QuoteSentToUnderwritterByRmDialogComponent implements OnInit {

    constructor(
        private ref: DynamicDialogRef,
        private quoteService: QuoteService

    ) { }

    ngOnInit(): void {
    }
    
    close() {
        this.quoteService.refresh((quote) => {
            this.ref.close();
        })
    }
}
