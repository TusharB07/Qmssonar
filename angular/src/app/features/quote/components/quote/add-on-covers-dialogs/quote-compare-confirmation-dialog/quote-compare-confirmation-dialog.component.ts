import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ILov } from 'src/app/app.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { FetchPastQuoteHistoryDialogComponent } from '../../fetch-past-quote-history-dialog/fetch-past-quote-history-dialog.component';

@Component({
    selector: 'quote-compare-confirmation-dialog',
    templateUrl: './quote-compare-confirmation-dialog.component.html',
    styleUrls: ['./quote-compare-confirmation-dialog.component.scss'],
    providers: [DialogService, MessageService]
})
export class QuoteCompareConfirmationDialogComponent implements OnInit {

    progress;

    id: string;
    quote: IQuoteSlip;
    optionsInsurer: ILov[];
    insurer: any[] = [];
    premiums: any[] = [];
    products: any[] = []
    selectedInsurer: any[] = [];
    selectedRMEmails: any[] = [];

    toWord = new ToWords();
    display: boolean = false;

    isSendForApproval: boolean;
    isSendToInsurer: boolean;

    currentUser$: any;


    private currentQuote: Subscription;
    private currentUser: Subscription;


    constructor(
        private router: Router,
        private dialogService: DialogService,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        public messageService: MessageService,
        private ref: DynamicDialogRef

    ) { }



    ngOnInit(): void {

    }

    // open() {
    //     this.ref.close();
    //     this.ref = this.dialogService.open(FetchPastQuoteHistoryDialogComponent, {
    //         header: '',
    //         width: '40%',
    //         contentStyle: { "max-height": "500px", "overflow": "auto" },
    //         baseZIndex: 10000
    //     });



    //     // this.router.navigateByUrl(`/`);
    // }
    // close() {
    //     this.ref.close();
    //     // this.router.navigateByUrl(`/`);

    // }

    yes() {
        // console.log('Yes')
        this.ref.close({ compare: true });
    }

    no() {
        // console.log('No')
        this.ref.close({ compare: false });
    }
}

