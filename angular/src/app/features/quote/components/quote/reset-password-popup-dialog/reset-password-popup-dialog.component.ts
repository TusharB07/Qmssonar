import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-reset-password-popup-dialog',
  templateUrl: './reset-password-popup-dialog.component.html',
  styleUrls: ['./reset-password-popup-dialog.component.scss']
})
export class ResetPasswordPopupDialogComponent implements OnInit {

  lastLogin: any;
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private config: DynamicDialogConfig,
    private deviceService: DeviceDetectorService
  ) { 
    this.lastLogin = this.config.data?.lastLogin
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
  }

  toresetPassword() {
    const ref1 = this.dialogService.open(ChangePasswordDialogComponent, {
      header: 'Reset Password',
      width: this.isMobile ? '350px' : '550px',
      height: this.isMobile ? '275px' : '400px',
      styleClass: 'customPopup',
      closable: false,
      closeOnEscape: false
    })

    ref1.onClose.subscribe((value) => {
      if (value == 'closed') {
        this.ref.close('closed');
      }
      if (value == 'changed') {
        this.ref.close('changed');
      }
    })
  }

  close() {
    this.ref.close('closed');
  }
}
