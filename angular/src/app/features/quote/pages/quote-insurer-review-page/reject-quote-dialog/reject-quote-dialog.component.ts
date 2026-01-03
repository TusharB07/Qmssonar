import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-reject-quote-dialog',
  templateUrl: './reject-quote-dialog.component.html',
  styleUrls: ['./reject-quote-dialog.component.scss']
})
export class RejectQuoteDialogComponent implements OnInit {

  quote: IQuoteSlip;
  quoteId: string = '';
  reason: string = '';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private quoteService: QuoteService,
    private messageService: MessageService
  ) {
    this.quoteId = this.config.data?.quoteId
    this.quote = this.config.data?.quote
    console.log(this.quote);
  }

  ngOnInit(): void {
  }

  rejectQuote() {
    let payload = {
      quoteId: this.quoteId,
      reason: this.reason
    }

    this.quoteService.rejectQuote(payload).subscribe(res => {
      console.log(res);
      this.messageService.add({
        severity: "success",
        summary: "Quote rejected successfully!"
      })
      this.ref.close(res['data']['entity'])
    })
  }
}
