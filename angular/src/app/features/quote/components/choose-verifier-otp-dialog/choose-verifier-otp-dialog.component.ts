import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FormMode, IOneResponseDto } from "src/app/app.model";
import { AccountService } from "src/app/features/account/account.service";
import { IBscFireLossOfProfitCover } from "src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model";
import { OtpService } from "src/app/features/admin/otp/otp.service";
import { IQuoteSlip } from "src/app/features/admin/quote/quote.model";
import { QuoteService } from "src/app/features/admin/quote/quote.service";
import { IUser } from "src/app/features/admin/user/user.model";
import { EnterVerifierOtpDialogComponent } from "../enter-verifier-otp-dialog/enter-verifier-otp-dialog.component";
import { ProposalVerifiedDialogComponent } from "../proposal-verified-dialog/proposal-verified-dialog.component";

@Component({
    selector: "app-choose-verifier-otp-dialog",
    templateUrl: "./choose-verifier-otp-dialog.component.html",
    styleUrls: ["./choose-verifier-otp-dialog.component.scss"]
})
export class ChooseVerifierOtpDialogComponent implements OnInit {
    id: string;
    verificationDetailsForm: FormGroup;
    otpForm: FormGroup;

    quote: IQuoteSlip;
    user: IUser;
    isCKYCTemplate: boolean = false;

    stage: 'enter-otp' | 'submit-otp' = 'enter-otp'
    //   modulePath: string = "/backend/admin/";

    constructor(
        public ref: DynamicDialogRef,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private dialogService: DialogService,
        private otpService: OtpService,
        private router: Router,
        private quoteService: QuoteService,
        private config: DynamicDialogConfig,
        private accountService: AccountService,
    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
        this.quote = this.config.data.quote;
        this.isCKYCTemplate = this.config.data.isCKYCTemplate
        console.log(this.config.data.quote)

        this.accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
            }
        })
    }

    ngOnInit(): void {
        this.createVerificationForm();
        this.createOtpForm();
    }

    createVerificationForm() {
        this.verificationDetailsForm = this.formBuilder.group({
            mobileNumber: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            verifier: [this.user.name]
        });
    }

    createOtpForm() {
        this.otpForm = this.formBuilder.group({
            //   enterPercentage: [quote?.enterPercentage ??  20,  [Validators.required, Validators.min(20),Validators.max(20)]],
            otp1: [null, [Validators.required]],
            otp2: [null, [Validators.required]],
            otp3: [null, [Validators.required]],
            otp4: [null, [Validators.required]],
        });
    }

    back() {
        this.config.header = 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,

        this.stage = 'enter-otp'

        this.otpForm.reset();

    }


    submitVerificationDetailsForm() {
        console.log('Submitted')

        if (this.verificationDetailsForm.valid) {
            const updatePayload = { ...this.verificationDetailsForm.value };

            updatePayload["quoteId"] = this.quote._id;

            console.log(updatePayload);
            //     updatePayload["momobileNumber"] = this.verificationDitailsForm.value["mobileNumber"].value;
            //     updatePayload["verifier"] = this.verificationDitailsForm.value["verifier"].value;
            //     if (this.mode === "new") {
            //       this.otpService.create(updatePayload).subscribe({
            //         next: partner => {
            //         },
            //         error: error => {
            //         }
            //       });
            //     }
            this.quoteService.generateOtp(updatePayload).subscribe({
                next: response => {

                    console.log(response)

                    this.config.header = 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,

                    this.stage = 'submit-otp'

                    // const ref = this.dialogService.open(EnterVerifierOtpDialogComponent, {
                    //     header: "Enter OTP",
                    //     data: {
                    //         quote: this.quote
                    //     },
                    //     width: "400px",
                    //     // height: '40%',
                    //     styleClass: "flatPopup "
                    // });
                }
            });
        }




        // this.ref.close();


        // this.otpService.otpGenerate(this.id).subscribe((result)=>{
        //   console.log('jbhasbncaskl')
        //    })
        // //    console.log(OTP)
    }

    submitOTPForm() {
        if (this.otpForm.valid) {
            const updatePayload = { ...this.otpForm.value };
            updatePayload['otp'] = `${updatePayload['otp1']}${updatePayload['otp2']}${updatePayload['otp3']}${updatePayload['otp4']}`
            updatePayload['quoteId'] = this.quote._id;
            this.quoteService.verifyOtp(updatePayload).subscribe({
                next: (response) => {
                    console.log(response)

                    this.ref.close();
                    this.quoteService.setQuote(this.quote);

                    const ref = this.dialogService.open(ProposalVerifiedDialogComponent, {
                        header: '',
                        data: {
                            quote: this.quote,
                            isCKYCTemplate: this.isCKYCTemplate
                        },
                        width: '400px',
                        // height: '40%',
                        styleClass: "flatPopup "
                    })
                    // ref.onClose.subscribe({
                    //     next: () => {
                    //     this.quoteService.setQuote(this.quote);
                    //     // this.quoteService.refresh();
                    //         }
                    // })
                }
            })

            console.log(this.otpForm.value);
        }
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
}
//generate otp in angular?
