import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-quote-sent-placement-slip-is-approved-dialog',
  templateUrl: './quote-sent-placement-slip-is-approved-dialog.component.html',
  styleUrls: ['./quote-sent-placement-slip-is-approved-dialog.component.scss']
})
export class QuoteSentPlacementSlipIsApprovedDialogComponent implements OnInit {

 

  constructor(
      private ref: DynamicDialogRef,
      private router: Router,
      private accountService: AccountService,
      private config: DynamicDialogConfig,
  ) {

   }

  ngOnInit(): void {

  }

  close() {
      this.ref.close();
  }
}