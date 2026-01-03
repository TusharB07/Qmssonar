import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-reason-for-quote-loss',
  templateUrl: './reason-for-quote-loss.component.html',
  styleUrls: ['./reason-for-quote-loss.component.scss']
})
export class ReasonForQuoteLossComponent implements OnInit {

  quote: IQuoteSlip
  private currentQuote: Subscription;
  currentUser$: Observable<IUser>;
  quotelossreason: any;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private quoteService: QuoteService,
    private dialogService: DialogService,
    private accountService: AccountService,
    private messageService: MessageService,
  ) {
    this.quote = this.config.data.quote;
    this.quotelossreason = this.config.data.quote.reason
    this.currentUser$ = this.accountService.currentUser$
   }

  ngOnInit(): void {
  }

}
