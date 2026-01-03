import { Component, OnInit } from '@angular/core';
import { IMarineTemplate, IQuoteSlip, MarineSIData } from '../../admin/quote/quote.model';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { QuoteService } from '../../admin/quote/quote.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { QuotemarinetemplateService } from '../../admin/Marine/quotemarinetemplate.service';

@Component({
  selector: 'app-marine-si-split-dialog',
  templateUrl: './marine-si-split-dialog.component.html',
  styleUrls: ['./marine-si-split-dialog.component.scss']
})
export class MarineSiSplitDialogComponent implements OnInit {
  quote: IQuoteSlip;

  private currentQuote: Subscription;
  marineSIData: MarineSIData = new MarineSIData()
  marineMainData: IMarineTemplate
  constructor(
    private quotemarinetemplateService: QuotemarinetemplateService,
    public config: DynamicDialogConfig,
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService, private messageService: MessageService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        if (this.quote?.marineDataId != undefined) {
          this.marineMainData = this.quote?.marineDataId as IMarineTemplate
          this.marineSIData = this.quote?.marineDataId['marineSIData'][0];
          
        }
      }
    })
  }

  ngOnInit(): void {
    //  this.quote = this.config.data.quote;
    this.quote = this.config.data.quote;
    if (this.quote?.marineDataId != undefined) {
      this.marineSIData = this.quote?.marineDataId['marineSIData'][0];
      this.marineSIData.marineSISplit.total = this.quote.totalSumAssured
    }
  }

  calculateSITotal() {
    this.marineSIData.marineSISplit.total = 0
    this.marineSIData.marineSISplit.total = (this.marineSIData.marineSISplit.estimatedTurnOver +
      this.marineSIData.marineSISplit.asPerInvoiceSta + this.marineSIData.marineSISplit.frieght +
      this.marineSIData.marineSISplit.customDuty + this.marineSIData.marineSISplit.gstOtherTaxes)
  }

  SaveSITabSplit() {
    if(this.marineSIData.marineSISplit.total == 0 || this.marineSIData.marineSISplit.total == undefined){
      this.messageService.add({ key: "error", severity: 'error', summary: 'Error', detail: 'Total is required', icon: 'pi-times', closable: false });
      return;
    }
    this.marineMainData.marineSIData = this.marineSIData;
    const updatePayload = this.marineMainData;
    this.quotemarinetemplateService.update(this.quote?.marineDataId["_id"], updatePayload).subscribe({
      next: partner => {
        console.log("ttest");
      },
      error: error => {
        console.log(error);
      }
    });
  }

  close() {

  }
}