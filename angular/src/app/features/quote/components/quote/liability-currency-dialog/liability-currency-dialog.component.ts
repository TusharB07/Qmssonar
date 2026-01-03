import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-liability-currency-dialog',
  templateUrl: './liability-currency-dialog.component.html',
  styleUrls: ['./liability-currency-dialog.component.scss']
})
export class LiabilityCurrencyDialogComponent implements OnInit {
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  dollarRate:number=0
  constructor(
    private ref: DynamicDialogRef, private quoteService: QuoteService, public config: DynamicDialogConfig,
  ) {
    this.quote = this.config.data.quote;
  }

  ngOnInit(): void {
  }

  close() {
    this.ref.close();
  }
  accept() {
    this.quoteService.update(this.quote._id, { dollarRate: this.quote.dollarRate, selectedCurrency: '$ Dollar' }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {

        this.quoteService.get(this.quote._id).subscribe({
          next: (dto: IOneResponseDto<IQuoteSlip>) => {
            this.quote = dto.data.entity;
            // console.log(this.quote)
            this.ref.close();
          },
          error: e => {
            console.log(e);
          }
        });
        // console.log(this.quote)
      },
      error: e => {
        console.log(e);
      }
    });
  }
  exit() {
    this.ref.close();
  }
}
