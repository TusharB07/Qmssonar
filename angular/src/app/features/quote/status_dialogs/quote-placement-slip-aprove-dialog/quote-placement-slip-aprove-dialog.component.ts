import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IUser } from 'src/app/features/admin/user/user.model';


@Component({
  selector: 'app-quote-placement-slip-aprove-dialog',
  templateUrl: './quote-placement-slip-aprove-dialog.component.html',
  styleUrls: ['./quote-placement-slip-aprove-dialog.component.scss']
})
export class QuotePlacementSlipAproveDialogComponent implements OnInit {

  user: IUser
  currentUser$: Observable<IUser>;
  quote: IQuoteSlip;

  constructor(
      private ref: DynamicDialogRef,
      private router: Router,
      private accountService: AccountService,
      private config: DynamicDialogConfig,
  ) {
      this.quote = this.config.data.quote
      console.log(this.quote);
      
      this.currentUser$ = this.accountService.currentUser$;
      this.currentUser$.subscribe(user => {
          this.user = user
          console.log(this.user);
      })
   }

  ngOnInit(): void {

  }

  close() {
      this.ref.close();
  }
}