import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IQuoteSlip, IWCRatesData } from '../../admin/quote/quote.model';
import { QuoteService } from '../../admin/quote/quote.service';
import { WCRatesFileUploadService } from './wc-ratesview-service';

@Component({
  selector: 'app-quote-wc-ratesview-dialog',
  templateUrl: './quote-wc-ratesview-dialog.component.html',
  styleUrls: ['./quote-wc-ratesview-dialog.component.scss']
})
export class WCRatesFileUploadDialogComponent implements OnInit {
  quote: IQuoteSlip;
  wcRatesInfo: IWCRatesData[] = [];
  isNamed: boolean = false;
  todaysdate: Date = new Date()
  constructor(
    public config: DynamicDialogConfig,
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService, private messageService: MessageService, private wcRatesFileUploadService: WCRatesFileUploadService) {

  }

  ngOnInit(): void {
    this.quote = this.config.data.quote;
    this.getWCRatesFileUploadSummary();
  }


  //   getWCRatesFileUploadSummary() {
  //     let payload = {};
  //     payload['quoteId'] = this.config.data.quote?._id;
  //     this.wcRatesFileUploadService.viewWCRatesSummary(payload).subscribe({
  //       next: summary => {
  //         if (summary.status == "success") {
  //           this.wcRatesInfo = summary.data.entities;
  //         } else {
  //           this.messageService.add({
  //             severity: 'fail',
  //             summary: "Failed to Show",
  //             detail: `${summary.status}`,
  //           })
  //         }
  //       }
  //     })
  //   }
  // }

  getWCRatesFileUploadSummary() {
    let wcEmpData = this.config.data.quote?.wcRatesDataId
    if (wcEmpData && wcEmpData.wcRatesData.length > 0) {
      if(this.config.data.tableType == 'Named'){
        this.isNamed = true;
      }
      this.wcRatesInfo = wcEmpData.wcRatesData;
    } else {
      this.messageService.add({
        severity: 'fail',
        summary: "Failed to Show",
        //detail: `${summary.status}`,
      })
    }
  }
}
