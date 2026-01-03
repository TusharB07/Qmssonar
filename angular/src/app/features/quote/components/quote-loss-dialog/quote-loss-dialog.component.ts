import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-quote-loss-dialog',
  templateUrl: './quote-loss-dialog.component.html',
  styleUrls: ['./quote-loss-dialog.component.scss']
})
export class QuoteLossDialogComponent implements OnInit {

  quote: IQuoteSlip
  private currentQuote: Subscription;
  currentUser$: Observable<IUser>;

  uploadLocationPhotographsUrl: string;
  uploadHttpHeaders: HttpHeaders;

  uploadRiskInspectionReportUrl: string;
  // uploadLocationPhotographsUrl: string;
  isMobile: boolean = false;
  isLoading: boolean;
  data = [];
  reason: string = '';

  dropdownOptions = [
    { label: 'Relationship', value: 'Relationship' },
    { label: 'Claim Pending', value: 'Claim Pending' },
    { label: 'Deviation in terms', value: 'Deviation in terms' },
    { label: 'Pricing', value: 'Pricing' },
    { label: 'Direct', value: 'Direct' },
    { label: 'Service Issue', value: 'Service Issue' },
    { label: 'Policy not taken or discontinued', value: 'Policy not taken or discontinued' }
  ];

  selectedReason: string;
  description: string;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private quoteService: QuoteService,
    private dialogService: DialogService,
    private accountService: AccountService,
    private messageService: MessageService,
  ) {
    this.quote = this.config.data.quote;
    this.currentUser$ = this.accountService.currentUser$
  }

  ngOnInit(): void {
  }

  lossQuote() {
    if (!this.selectedReason) {
      this.messageService.add({ key: "error", severity: 'error', detail: 'Please select a reason for loss quote.' });
      return;
    }
    if (!this.description) {
      this.messageService.add({ key: "error", severity: 'error', detail: 'Please select a reason for loss quote.' });
      return;
    }
    const payload = {
      quoteState: "Loss Quote",
      reason: this.selectedReason,
      description: this.description
    };
    this.quoteService.lossquote(this.quote._id, payload).subscribe({
      next: response => {
        this.messageService.add({ key: "success", severity: 'success', detail: 'Successfully lost quote' });
      },
      error: err => {
        this.messageService.add({ key: "error", severity: 'error', detail: 'Failed to loss quote' });
        setTimeout(() => {
          this.ref.close();
        }, 500);
      }
    });
  }
  

}
