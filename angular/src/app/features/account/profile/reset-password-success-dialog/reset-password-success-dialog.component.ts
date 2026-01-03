import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-reset-password-success-dialog',
  templateUrl: './reset-password-success-dialog.component.html',
  styleUrls: ['./reset-password-success-dialog.component.scss']
})
export class ResetPasswordSuccessDialogComponent implements OnInit {

  constructor(private accountService:AccountService, public ref: DynamicDialogRef,) { }

  ngOnInit() {
  }
  passwordResetWithLogout(){
    this.accountService.logout().subscribe();
    this.ref.close();
  }
}