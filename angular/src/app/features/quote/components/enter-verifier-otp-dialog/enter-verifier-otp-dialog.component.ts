import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { BehaviorSubject } from "rxjs";
import { IQuoteSlip } from "src/app/features/admin/quote/quote.model";
import { QuoteService } from "src/app/features/admin/quote/quote.service";
import { ProposalVerifiedDialogComponent } from "../proposal-verified-dialog/proposal-verified-dialog.component";

@Component({
    selector: "app-enter-verifier-otp-dialog",
    templateUrl: "./enter-verifier-otp-dialog.component.html",
    styleUrls: ["./enter-verifier-otp-dialog.component.scss"]
})
export class EnterVerifierOtpDialogComponent implements OnInit {
    time: BehaviorSubject<string> = new BehaviorSubject("00:00");
    timer: number;
    id: string;
    quote: IQuoteSlip;
    submitOtpForm: FormGroup;
    submitted: boolean;

    constructor(
        public ref: DynamicDialogRef,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private dialogService: DialogService,
        private quoteService: QuoteService,
        private config: DynamicDialogConfig
    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
        this.quote = this.config.data.quote;
        console.log(this.config.data.quote)
        // this.startTimer(0.99);
    }

    //   startTimer(duration: number) {
    //     this.timer = duration * 60;
    //     setInterval(() => {
    //       this.updateTimeValue();
    //     }, 1000);
    //   }
    //   updateTimeValue() {
    //     let minutes: any = this.timer / 60;
    //     let seconds: any = this.timer % 60;

    //     minutes = String("0" + Math.floor(minutes)).slice(-2);
    //     seconds = String("0" + Math.floor(seconds)).slice(-2);

    //     const text = minutes + ":" + seconds;
    //     this.time.next(text);

    //     --this.timer;
    //   }

    ngOnInit(): void {
        this.createForm()
    }

    createForm() {
        this.submitOtpForm = this.formBuilder.group({
            //   enterPercentage: [quote?.enterPercentage ??  20,  [Validators.required, Validators.min(20),Validators.max(20)]],
            otp1: [null, [Validators.required]],
            otp2: [null, [Validators.required]],
            otp3: [null, [Validators.required]],
            otp4: [null, [Validators.required]]
        });
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

    submitOTP() {
        if (this.submitOtpForm.valid) {
            const updatePayload = { ...this.submitOtpForm.value };
            updatePayload['otp'] = `${updatePayload['otp1']}${updatePayload['otp2']}${updatePayload['otp3']}${updatePayload['otp4']}`
            updatePayload['quoteId'] = this.quote._id;
            this.quoteService.verifyOtp(updatePayload).subscribe({
                next: (response) => {
                    console.log(response)

                    this.ref.close();
                    const ref = this.dialogService.open(ProposalVerifiedDialogComponent, {
                        header: '',
                        data: {
                            quote: this.quote,
                        },
                        width: '270px',
                        // height: '40%',
                        styleClass: "flatPopup "
                    })

                    ref.onClose.subscribe({
                        next: () => {
                            this.quoteService.refresh()
                        }
                    })
                }
            })

            console.log(this.submitOtpForm.value);
        }


    }
}
