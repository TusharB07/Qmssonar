import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { RiskCoverLetterDialogComponent } from '../risk-cover-letter-dialog/risk-cover-letter-dialog.component';

@Component({
  selector: 'app-quote-slip-sent-for-placement-dialog',
  templateUrl: './quote-slip-sent-for-placement-dialog.component.html',
  styleUrls: ['./quote-slip-sent-for-placement-dialog.component.scss']
})
export class QuoteSlipSentForPlacementDialogComponent implements OnInit {

  constructor(
    private ref: DynamicDialogRef,
    private router: Router,
    // public ref: DynamicDialogRef,
    private quoteService: QuoteService,
    private dialogService: DialogService,
) { }

ngOnInit(): void {

}RiskCoverLetterDialogComponent


openRiskCoverLetter() {
  const ref = this.dialogService.open(RiskCoverLetterDialogComponent, {
      width: '800px',
      styleClass: 'flatPopup',
      data: {
        //   quote: quote,
      }
  })
  this.ref.close();

}

close() {
    this.ref.close();
}
}
