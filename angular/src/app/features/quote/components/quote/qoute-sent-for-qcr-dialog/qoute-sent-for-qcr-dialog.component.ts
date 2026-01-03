import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-qoute-sent-for-qcr-dialog',
  templateUrl: './qoute-sent-for-qcr-dialog.component.html',
  styleUrls: ['./qoute-sent-for-qcr-dialog.component.scss']
})
export class QouteSentForQcrDialogComponent implements OnInit {
  user: IUser;
  msg: string = "Quote Sent to Intermediary";
  constructor(
    private ref: DynamicDialogRef,
    private router: Router, private accountService: AccountService,
  ) {
    // * DO NOT TOUCH
    this.accountService.currentUser$.subscribe({  
      next: user => {
        this.user = user
        if (this.user.partnerId["brokerModeStatus"] == true) {
          this.msg = "Quote is ready for the QCR"
        }
      }
    });
  }

  ngOnInit(): void {

  }


  close() {
    this.ref.close();
    // window.location.reload()

    //this.router.navigateByUrl('/')
  }


}
