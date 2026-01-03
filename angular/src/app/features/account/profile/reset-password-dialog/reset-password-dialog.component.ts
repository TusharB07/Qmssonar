import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidator } from 'src/app/shared/validators';
import { Encryption } from 'src/app/shared/encryption';
import { ResetPasswordSuccessDialogComponent } from '../reset-password-success-dialog/reset-password-success-dialog.component';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss']
})
export class ResetPasswordDialogComponent implements OnInit {

  resetPasswordForm: FormGroup;
  returnUrl: string;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumberCase: boolean;
  hasSpecialCase: boolean;
  hasLengthCase: boolean;
  show: boolean = false;
  confirmShow : boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService:DialogService
  ) { }

  ngOnInit(): void {
    this.createResetPasswordForm()
    //this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || "/log";

  }

  createResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: [null, [Validators.required, CustomValidator.passwordValidator]],
      confirmPassword: [null, [Validators.required, CustomValidator.passwordValidator]]
    })
  }


  onResetPassword() {
    const payload = { ...this.resetPasswordForm.value }
    if (this.resetPasswordForm.valid) {
      if (payload['newPassword'] == payload['confirmPassword']) {

        const encrptednewPassword = Encryption.encryptData(payload['newPassword'])
        const encrptedconfirmPassword = Encryption.encryptData(payload['confirmPassword'])

        delete payload['newPassword']
        delete payload['confirmPassword']

        payload['newPassword'] = encrptednewPassword
        payload['confirmPassword'] = encrptedconfirmPassword

        console.log(payload);
        
        this.accountService.resetPassword(payload).subscribe({
          next: v => {
            // this.loading = false;
            this.ref.close()
            // this.messageService.add({
            //   severity: "success",
            //   summary: "Successful",
            //   detail: `Password Changed Sucessfully`,
            //   life: 3000
            // });
            // this.accountService.logout().subscribe();
            const ref = this.dialogService.open(ResetPasswordSuccessDialogComponent,{
              styleClass :  'customPopup',
              width : '410px',
              height:'148px',
              closable:false
          })
          },
          error: e => {
            console.log(e);
          }
        });
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Failed",
          detail: `new password and confirm password should be same`,
          life: 3000
        });
      }
    }
  }

  validate() {
    let UC_REG = /^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{1,25}$/
    let LC_REG = /^(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{1,25}$/
    let NU_REG = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{1,25}$/
    let SP_REG = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{1,25}$/
    if (UC_REG.test(this.resetPasswordForm.value.newPassword)) {
      this.hasUpperCase = true;
    }
    else {
      this.hasUpperCase = false;
    }
    if (LC_REG.test(this.resetPasswordForm.value.newPassword)) {
      this.hasLowerCase = true;
    }
    else {
      this.hasLowerCase = false;
    }
    if (NU_REG.test(this.resetPasswordForm.value.newPassword)) {
      this.hasNumberCase = true;
    }
    else {
      this.hasNumberCase = false;
    }
    if (SP_REG.test(this.resetPasswordForm.value.newPassword)) {
      this.hasSpecialCase = true;
    }
    else {
      this.hasSpecialCase = false;
    }
    if (this.resetPasswordForm.value.newPassword.length > 7) {
      this.hasLengthCase = true;
    }
    else {
      this.hasLengthCase = false;
    }
  }

  onCanel() {
    this.ref.close('Hi');
  }

  toggleShow() {
    this.show = !this.show
  }

  toggleConfimrShow() {
    this.confirmShow = !this.confirmShow
  }

}
