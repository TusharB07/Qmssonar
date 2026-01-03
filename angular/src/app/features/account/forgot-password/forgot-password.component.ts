import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/validators';
import { MessageService } from 'primeng/api';
import { Encryption } from 'src/app/shared/encryption';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  loginForm: FormGroup;
  resetForm: FormGroup;
  returnUrl: string;
  loading: Boolean = false;
  submitted: boolean = false;
  submitted1: boolean = false;
  isOTPSent: boolean = false;
  OTPSent: boolean = false;
  generateOTP: boolean = false;
  display: any;
  show :boolean = false
  confirmShow: boolean = false
  isMatchPassword: boolean = false;
  isPasswordReset: boolean = false;
  isMobile: boolean = false;

  constructor(
    public app: AppComponent,
    private accountService: AccountService,
    private router: Router,
    private messageService: MessageService,
    private deviceService: DeviceDetectorService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.createLoginForm();
    // this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || "/backend";
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.maxLength(100), Validators.email]),
    });
    this.resetForm = new FormGroup({
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(64)]),
      newPassword: new FormControl("", [Validators.required, CustomValidator.passwordValidator]),
      confirmPassword: new FormControl("", [Validators.required, CustomValidator.passwordValidator]),
      otp1: new FormControl(null, [Validators.required]),
      otp2: new FormControl(null, [Validators.required]),
      otp3: new FormControl(null, [Validators.required]),
      otp4: new FormControl(null, [Validators.required])
    });
  }

  onSubmit(email) {
    console.log(email.value);
    let payload = {}
    payload['email'] = email.value;
    this.timer(0.5);
    this.accountService.sendOtp(payload).subscribe(res => {
      this.isOTPSent = true;
      this.resetForm.patchValue({
        email: email.value
      })
    })
  }

  matchPassword() {
    if(this.resetForm.value['confirmPassword'] && this.resetForm.value['newPassword'] == this.resetForm.value['confirmPassword']) {
      this.isMatchPassword = true;
    }
    else {
      this.isMatchPassword = false;
    }
  }

  resetPassword() {
    if (this.resetForm.valid) {
      if (this.resetForm.value.newPassword == this.resetForm.value.confirmPassword) {
        const updatePayload = {};
        updatePayload['newPassword'] = this.resetForm.value.newPassword
        updatePayload['confirmPassword'] = this.resetForm.value.confirmPassword
        updatePayload['email'] = this.loginForm.value.email
        updatePayload['otp'] = `${this.resetForm.value['otp1']}${this.resetForm.value['otp2']}${this.resetForm.value['otp3']}${this.resetForm.value['otp4']}`
        let encryptedOtp = Encryption.encryptData(updatePayload['otp'])
        updatePayload['otp'] = encryptedOtp
        updatePayload['email'] = this.loginForm.value.email

        const encryptedNewPassword = Encryption.encryptData(updatePayload["newPassword"])
        const encryptedConfirmPassword = Encryption.encryptData(updatePayload["confirmPassword"])

        updatePayload['newPassword'] = encryptedNewPassword
        updatePayload['confirmPassword'] = encryptedConfirmPassword

        console.log(updatePayload);
        this.accountService.changePassword(updatePayload).subscribe(res => {
          this.loginForm.reset();
          this.resetForm.reset();
          this.isPasswordReset =true;
        }, e=> {
          if(e == 'OTP Attemp Excceded') {
            // this.router.navigateByUrl('/account/forgot-password')
            this.ngOnInit();
            this.isOTPSent = false;
            this.submitted = false;
          }
          if(e == 'Invalid OTP') {
            this.messageService.add({key: "error", severity: 'error', detail: 'Invalid OTP'})
          }
        })
      }
      else {
        this.messageService.add({ key: "error", severity: 'error', summary: 'Error', detail: 'New Password should match Confirm Password', icon: 'pi-times', closable: false });
      }
    }
  }
  
  navigateToLogin() {
    this.router.navigateByUrl('account/login')
  }

  move(e: any, p: any, c: any, n: any) {
    var length = c.value.length;
    var maxlength = c.getAttribute("maxlength");
    if (length == maxlength) {
      if (n != "") {
        n.focus();
      }
    }
    if (e.key === "Backspace") {
      if (p != "") {
        p.focus();
      }
    }
  }

  resendOTP() {
    this.timer(0.5);
    this.accountService.sendOtp({ email: this.loginForm.value.email }).subscribe(res => {
      this.generateOTP = true
    },
      error => {
        this.messageService.add({ key: "error", severity: 'error', summary: 'Error', detail: 'OTP generation failed', icon: 'pi-times', closable: false });
      })
  }

  timer(minute: number) {

    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 30;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 29;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      this.OTPSent = true;

      if (seconds == 0) {
        this.OTPSent = false;
        clearInterval(timer);
      }
    }, 1000);
  }

  toggleShow() {
    this.show = !this.show
  }

  toggleConfimrShow() {
    this.confirmShow = !this.confirmShow
  }

}
