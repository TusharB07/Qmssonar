import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';

@Component({
    selector: 'app-quote-select-broker-for-compare-dialog',
    templateUrl: './quote-select-broker-for-compare-dialog.component.html',
    styleUrls: ['./quote-select-broker-for-compare-dialog.component.scss']
})
export class QuoteSelectBrokerForCompareDialogComponent implements OnInit {

    brokers: any[];
    selectedBrokers: any[] = []

    brokerWiseQuotes: IQuoteSlip[]

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig
    ) {
        this.brokerWiseQuotes = this.config.data.brokerWiseQuotes


    }

    ngOnInit(): void {
        console.log(this.config.data.brokerWiseQuotes);
        console.log(JSON.parse(this.config.data?.selectedBrokers ?? '[]'))
        this.selectedBrokers = JSON.parse(this.config.data?.selectedBrokers ?? '[]')
        // this.brokers = this.config.data.brokerWiseQuotes.map(item => item.brokerName);
        // if (this.config.data.brokerWiseQuotes?.length > 0) {
        //     this.selectedBrokers = this.config.data.selectedBrokers.map(item => item.brokerName);
        // }
    }

    apply() {
        if (this.selectedBrokers.length > 0) {
            this.ref.close(this.selectedBrokers)

        }
        // console.log(this.selectedBrokers)
    }


}
