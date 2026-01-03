import { Component, OnInit, HostListener } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponent } from "src/app/app.component";
import { AccountService } from "../account.service";
import { CustomValidator } from "src/app/shared/validators";
import * as CryptoJS from 'crypto-js';
import { Encryption } from "src/app/shared/encryption";
import { MessageService } from "primeng/api";
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from "src/environments/environment";


@Component({
  selector: "app-av-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginOTPForm: FormGroup;
  otpForm: FormGroup;
  returnUrl: string;
  loading: Boolean = false;
  submitted: boolean = false;
  submitted1: boolean = false;
  submitted2: boolean = false;
  isLoginWithMobile: boolean = false;
  isOTPGenerated: boolean = false;
  hiddenEmail = '';
  OTPSent: boolean = false;
  confirmShow: boolean = false;
  display: any;
  userType: any;
  userOptions = [];
  selectedUser = '';
  mobilenumber;
  isMobile: boolean = false;
  isLoginWithEmailOtp: boolean = false;
  isOTPRequired:boolean = true;
  isLokton: boolean;


  checkCapsLock(e) {
    let input = document.getElementById("passwordField")
    let text = document.getElementById("text")
    input.addEventListener("keyup", function(event){
      if(event.getModifierState("CapsLock")){
        text.style.display = "block"
      }
      else {
        text.style.display = "none"
      }
    })
  }

  constructor(
    public app: AppComponent,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public messageService: MessageService,
    private deviceService: DeviceDetectorService
  ) { }

  ngOnInit(): void {
    // this.isLokton = true;
    this.isLokton = environment.isLokton;
    console.log("isLokton", this.isLokton);
    this.userType = 'intermediary'
    this.userOptions = [{ label: 'Broker', value: 'broker' }, { label: 'Agent', value: 'agent' }, { label: 'Banca', value: 'banca' }]
    this.isMobile = this.deviceService.isMobile();
    this.createLoginForm();
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || "/backend";
    console.log(this.deviceService.isMobile());
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required]),  //CustomValidator.emailValidator
      password: new FormControl("", [Validators.required, Validators.maxLength(64)])
    });
  }
  createLoginOTPForm() {
    this.loginOTPForm = new FormGroup({
      mobile: new FormControl("", [Validators.required, CustomValidator.phoneValidator]),
    });
  }
  createLoginOTPWithEmailForm() {
    this.loginOTPForm = new FormGroup({
      emailOtp: new FormControl("", [Validators.required])
    });
  }
  createOTPForm() {
    this.otpForm = new FormGroup({
      otp1: new FormControl(null, [Validators.required]),
      otp2: new FormControl(null, [Validators.required]),
      otp3: new FormControl(null, [Validators.required]),
      otp4: new FormControl(null, [Validators.required])
    });
  }
  enableForm() {
    setTimeout(() => {
        this.otpForm.enable();
    });
  }

  onSubmit() {
    if (this.loginForm.valid && this.selectedUser != '') {
      let payload = { ...this.loginForm.value }
      if (this.userType == 'insurance') {
        payload['userType'] = this.userType
        payload['roleName'] = this.selectedUser
      }
      else {
        payload['userType'] = this.userType
        payload['partnerType'] = this.selectedUser
      }

      const encryptData = Encryption.encryptData(payload.password)

      delete payload.password
      payload.password = encryptData
      payload.email = payload.email.toLowerCase()
      console.log(payload)
      // To Decrypt
      // const bytes = CryptoJS.AES.decrypt(generated_signature, ENCRYPTION_KEY);
      // const originalText = bytes.toString(CryptoJS.enc.Utf8);
      // console.log(originalText)
      this.loading = true;
      if(this.userType == 'intermediary'){
        payload.IS_FETCH_TOKEN_ENABLED = false;
      }
      this.accountService.login(payload).subscribe({
      
        
        next: v => {
          this.loading = false;
          console.log(v);
      
          if (v && v.status === 'fail') {
            this.isOTPGenerated = false;
          } else if (v && v.status === 'success') {
            if(this.userType == 'intermediary'){
              this.isOTPGenerated = true;
              this.generateEmailOTP();
              this.createOTPForm();
              this.otpForm.disable();
            }
            else{
              this.loading = false;
              console.log(`About to navigate to ${this.returnUrl}`);
              this.router.navigateByUrl(this.returnUrl);
            }
         
          } else {
            console.log('Unexpected response format:', v);
          }
        },
        error: e => {
          console.log('Subscription error:', e);
          this.loading = false;
        }
      });
    }
    if (!this.selectedUser) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: "",
        detail: `No User type is selected`,
        life: 3000
      });
    }
  }

  onSubmitWithoutType() {
    let payload = { ...this.loginForm.value }
    
    const encryptData = Encryption.encryptData(payload.password)

    delete payload.password
    payload.password = encryptData
    payload.email = payload.email.toLowerCase()
    console.log(payload)

    this.loading = true;

    payload.IS_FETCH_TOKEN_ENABLED = false;

    this.accountService.login(payload).subscribe({
      next: v => {
        this.loading = false;
        console.log(v);

        if (v && v.status === 'fail') {
          this.isOTPGenerated = false;
        } else if (v && v.status === 'success') {
          if (this.userType == 'intermediary') {
            this.isOTPGenerated = true;
            this.generateEmailOTP();
            this.createOTPForm();
            this.otpForm.disable();
          }
          else {
            this.loading = false;
            console.log(`About to navigate to ${this.returnUrl}`);
            this.router.navigateByUrl(this.returnUrl);
          }

        } else {
          console.log('Unexpected response format:', v);
        }
      },
      error: e => {
        console.log('Subscription error:', e);
        this.loading = false;
      }
    });
  }


  navigateToForgotPass() {
    this.router.navigateByUrl('/account/forgot-password')
  }

  toggleConfimrShow() {
    this.confirmShow = !this.confirmShow
  }

  navigatetoLoginWithMobile() {
    this.createLoginOTPForm()
    this.isLoginWithMobile = true;
    this.isLoginWithEmailOtp =  false;
  }
  navigatetoLoginWithEmail() {
    if(this.isOTPRequired){
      this.isOTPGenerated = true;
  
      // this.createLoginOTPWithEmailForm()
      this.onSubmit();
      this.isLoginWithMobile = true;
      // this.isLoginWithEmailOtp =  true;  
    }else{
      // this.onSubmit();
    }
  }

  navigatetoLoginWithPassword() {
    this.createLoginForm()
    this.isLoginWithMobile = false;
    this.isLoginWithEmailOtp = false;
  }

  hideWord(str) {
    return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
  }

  hideEmail(email) {
    var arr = email.split("@");
    this.hiddenEmail = this.hideWord(arr[0]) + "@" + this.hideWord(arr[1]);
  }

  _keyUp(event: any) {
    console.log('hi');

    const pattern = /^[6-9][0-9]{9}$/;
    let inputChar = String.fromCharCode(event.key);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  generateEmailOTP(){
      console.log(this.loginForm)
      let payload = {
        email: this.loginForm.value.email,
        IS_EMAIL_OTP:true      
      }
      console.log(payload);
      if (this.userType == 'insurance') {
        payload['userType'] = this.userType
        payload['roleName'] = this.selectedUser
      }
      else {
        payload['userType'] = this.userType
        payload['partnerType'] = this.selectedUser
      }
      // this.loading = true;

      // send otp servie call
      // this.accountService.sendOtp(payload).subscribe(res => {
        this.loading = false;
        this.createOTPForm();
        this.isOTPGenerated = true;
        this.hideEmail(this.loginForm.value['email']);
        this.enableForm();
      // })
    if (!this.selectedUser && !this.isLokton) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: "",
        detail: `No User type is selected`,
        life: 3000
      });
    }
    
  }

  generateOTP() {
    if (this.loginOTPForm.valid && this.selectedUser != '') {
      let payload = {
        mobile: this.loginOTPForm.value.mobile
      }
      if (this.userType == 'insurance') {
        payload['userType'] = this.userType
        payload['roleName'] = this.selectedUser
      }
      else {
        payload['userType'] = this.userType
        payload['partnerType'] = this.selectedUser
      }
      this.loading = true;
      this.accountService.sendOtp(payload).subscribe(res => {
        this.loading = false;
        this.createOTPForm();
        this.isOTPGenerated = true;
        this.hideEmail(this.loginForm.value['email']);
      })
    }
    if (!this.selectedUser && !this.isLokton) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: "",
        detail: `No User type is selected`,
        life: 3000
      });
    }
    // this.verifyOTP();
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

  dropdownOptions(type:any) {
    switch (type) {
      case 'intermediary':
        this.isOTPRequired = true;
        break;
      case 'insurance':
          this.isOTPRequired = false;
          this.isLoginWithMobile = false;
      this.isLoginWithEmailOtp =  false;
        break;
      case 'other':
        this.isOTPRequired = false;
        this.isLoginWithMobile = false;
      this.isLoginWithEmailOtp =  false;
        break;
    }
    if (this.userType == 'intermediary') {
      this.userOptions = [{ label: 'Broker', value: 'broker' }, { label: 'Agent', value: 'agent' }, { label: 'Banca', value: 'banca' }]
    }
    if (this.userType == 'insurance') {
      this.userOptions = [{ label: 'Relationship Manager (RM)', value: 'insurer_rm' }, { label: 'Underwriter', value: 'insurer_underwriter' },{label : 'Operations' , value : 'operations'}]
    }
    if (this.userType == 'other') {
      this.userOptions = [{ label: 'Admin', value: 'admin' }, { label: 'Super Admin', value: 'super_admin' }]
    }
  }

  resendOTP() {
    this.timer(0.5);
    // this.isOTPGenerated = true;
    this.generateEmailOTP()
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

  verifyOTP() {
    console.log("i am in");
    if (this.otpForm.valid) {
      const updatePayload = {};
      updatePayload['otp'] = `${this.otpForm.value['otp1']}${this.otpForm.value['otp2']}${this.otpForm.value['otp3']}${this.otpForm.value['otp4']}`
      let encryptedOtp = Encryption.encryptData(updatePayload['otp'])
      updatePayload['otp'] = encryptedOtp
      if(this.isLoginWithMobile){
        updatePayload['mobile'] = this.loginOTPForm.value.mobile ? this.loginOTPForm.value.mobile : null
      }
      updatePayload['email'] = this.loginForm.value.email,

      this.loading = true;
      console.log("i am in");
      updatePayload['IS_FETCH_TOKEN_ENABLED'] = true;
      // this.accountService.login(updatePayload).subscribe({
      //   next: v => {

      // if (v && v.status === 'success') {
            this.loading = false;
            console.log(`About to navigate to ${this.returnUrl}`);
            this.router.navigateByUrl(this.returnUrl);
         
          // } else {
            // console.log('Unexpected response format:', v);
          // }
        // },
        // error: e => {
        //   this.otpForm.reset();
        //   console.log('Subscription error:', e);
        //   this.loading = false;
        // }
        // },
      // );
    }
  }

  backToMobile() {
    console.log("i am in");
    
    this.isOTPGenerated = false;
    // this.isLoginWithMobile = true;
  }
  //   increaseWidth(x){
  //     var numnrOfCharacters = x.value.length;
  //     if( numnrOfCharacters >= 10){
  //         var length = numnrOfCharacters + "ch";
  //         x.style.width = length
  //     }
  //   }

}
