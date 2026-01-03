import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountService } from 'src/app/features/account/account.service';
import { Encryption } from 'src/app/shared/encryption';
import { FocusManagementService } from 'src/app/features/service/focusmanagementservice';
import { IUser } from 'src/app/features/admin/user/user.model';
import { Observable } from "rxjs";
import { ResetPasswordSuccessDialogComponent } from 'src/app/features/account/profile/reset-password-success-dialog/reset-password-success-dialog.component';


@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {
  resetPasswordForm: FormGroup;
  returnUrl: string;
  confirmShow: boolean = false;
  show: boolean = false;
  oldShow: boolean = false;
  lastLogin: any;
  currentUser$: Observable<IUser>;

  constructor(
    private formBuilder: FormBuilder,
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private focusService: FocusManagementService,
    private elementRef: ElementRef,
    private dialogService:DialogService
  ) { 
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe(user => {
      if(user){
        this.lastLogin = user.lastLogin;
        
      }
    })
  }

  ngOnInit(): void {
    this.createResetPasswordForm()
    //this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || "/log";

  }

  createResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword: new FormControl(null, []),
      newPassword: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required])
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

        this.accountService.resetPassword(payload).subscribe({
          next: v => {
            // this.loading = false;
            this.ref.close('changed');
            // this.messageService.add({
            //   severity: "success",
            //   summary: "Successful",
            //   detail: `Password Changed Sucessfully`,
            //   life: 3000
            // });
            const ref = this.dialogService.open(ResetPasswordSuccessDialogComponent,{
              styleClass :  'customPopup',
              width : '410px',
              height:'148px',
              closable:false
          })
            this.accountService.logout().subscribe();
            this.ref.close('changed');
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

  onFirstResetPassword(){
    const payload = { ...this.resetPasswordForm.value }
    if (this.resetPasswordForm.valid) {
      if (payload['newPassword'] == payload['confirmPassword']) {

        const encryptedOldPassword = Encryption.encryptData(payload['oldPassword']);
        const encrptednewPassword = Encryption.encryptData(payload['newPassword'])
        const encrptedconfirmPassword = Encryption.encryptData(payload['confirmPassword'])

        delete payload['oldPassword']
        delete payload['newPassword']
        delete payload['confirmPassword']

        payload['oldPassword'] = encryptedOldPassword
        payload['newPassword'] = encrptednewPassword
        payload['confirmPassword'] = encrptedconfirmPassword

        this.accountService.resetPassword(payload).subscribe({
          next: v => {
            // this.loading = false;
            this.ref.close('changed');
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: `Password Changed Sucessfully`,
              life: 3000
            });
            // this.accountService.logout();
            this.ref.close('changed');
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
  toggleConfimrShow() {
    this.confirmShow = !this.confirmShow
  }
  toggleShow() {
    this.show = !this.show
  }
  toggleOldShow(){
    this.oldShow = !this.oldShow
  }
  onCanel() {
    this.ref.close('closed');
  }

  ngAfterViewInit() {
    const elements = this.elementRef.nativeElement.querySelectorAll('input, button');
    const focusableElements = elements ? Array.from(elements) as HTMLElement[] : [];
    this.focusService.registerFocusableElements(focusableElements);
    this.focusService.focusNextElement();
  }
}
