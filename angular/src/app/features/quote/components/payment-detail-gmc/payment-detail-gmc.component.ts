import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Subscription, Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { IQuoteGmcTemplate, IQuoteOption } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { GmcOptionsService } from '../gmc-coverages-options-dialog/gmc-options.service';

@Component({
  selector: 'app-payment-detail-gmc',
  templateUrl: './payment-detail-gmc.component.html',
  styleUrls: ['./payment-detail-gmc.component.scss']
})
export class PaymentDetailGmcComponent implements OnInit {
  @Input() quoteId: any;
  @Input() optionId: any;
  private currentQuote: Subscription;
  quoteOptionData: IGMCTemplate
  templateData: any;
  isIGSTDisabled = false;

  isPendingPayment: boolean;
  pendingStatus: boolean;
  paymentPandingStatus: boolean;
  currentUser$: Observable<IUser>;

  quoteOption: IQuoteGmcTemplate
  paymentDetailsForm: FormGroup;
  submitted = false;
  fb: any;
  quoteGmcOptionsLst: IQuoteGmcTemplate[]
  constructor(
    private formBuilder: FormBuilder,
    private quoteOptionService: QuoteOptionService,
    private messageService: MessageService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private quoteService: QuoteService,
    private dialogService: DialogService,
    private accountService: AccountService,
    private gmcOptionsService: GmcOptionsService,

  ) {

    this.quoteId = this.config.data.quoteId;
    this.currentUser$ = this.accountService.currentUser$
    this.optionId = this.config?.data?.optionId;
    console.log(this.config);

    //this.getOptions();

  }
  getOptions() {
    this.quoteService.getAllQuoteOptions(this.quoteId).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.quoteOption = dto.data.entity.filter(x => x._id == this.optionId)[0];
        this.templateData = this.quoteOption
      },
      error: e => {
        console.log(e);
      }
    });
  }
  ngOnInit(): void {
    this.paymentDetailsForm = this.formBuilder.group({
      // referenceNo: ['', Validators.required],
      // chequeNo: ['', Validators.required],
      // bankName: ['', Validators.required],
      // paymentDate: ['', Validators.required],
      // paymentAmount: ['', [Validators.required, Validators.min(0)]],
      cgst: ['',[Validators.min(9)] ],
      sgst: ['', [Validators.min(9)]],
      igst: ['',],
      totalGST: ['', Validators.required], // Adding the totalGST field
      // totalGSTPercentage: ['', Validators.required], // Total GST Percentage field
      totalGSTAmount: ['', Validators.required], // Total GST Amount field
      amountWithGST: ['', Validators.required], // Amount with GST field
      referenceNo: [this.templateData?.referenceNo || '', Validators.required],
      chequeNo: [this.templateData?.chequeNo || '', Validators.required],
      bankName: [this.templateData?.bankName || '', Validators.required],
      paymentDate: [this.templateData?.paymentDate || '', Validators.required],
      paymentAmount: [
        this.templateData?.paymentAmount || 0,
        [Validators.required, Validators.min(0)]
      ]
    });
    this.quoteService.getAllQuoteOptions(this.quoteId).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.quoteOption = dto.data.entity.filter(x => x._id == this.optionId)[0];
        this.templateData = this.quoteOption
        this.paymentDetailsForm = this.formBuilder.group({
          // referenceNo: ['', Validators.required],
          // chequeNo: ['', Validators.required],
          // bankName: ['', Validators.required],
          // paymentDate: ['', Validators.required],
          // paymentAmount: ['', [Validators.required, Validators.min(0)]],
          cgst: ['',[Validators.min(9)] ],
          sgst: ['', [Validators.min(9)]],
          igst: ['',],
          totalGST: ['', Validators.required], // Adding the totalGST field
          // totalGSTPercentage: ['', Validators.required], // Total GST Percentage field
          totalGSTAmount: ['', Validators.required], // Total GST Amount field
          amountWithGST: ['', Validators.required], // Amount with GST field
          referenceNo: [this.templateData?.referenceNo || '', Validators.required],
          chequeNo: [this.templateData?.chequeNo || '', Validators.required],
          bankName: [this.templateData?.bankName || '', Validators.required],
          paymentDate: [this.templateData?.paymentDate || '', Validators.required],
          paymentAmount: [
            this.templateData?.paymentAmount || 0,
            [Validators.required, Validators.min(0)]
          ]
        });
      },
      error: e => {
        console.log(e);
      }
    });
  }

  get f() {
    return this.paymentDetailsForm.controls;
  }

  checkGST(): void {
    const cgst = this.paymentDetailsForm.get('cgst')?.value || 0;
    const sgst = this.paymentDetailsForm.get('sgst')?.value || 0;

    // Disable IGST if either CGST or SGST is filled
    if (cgst || sgst) {
      this.isIGSTDisabled = true;
      // this.paymentDetailsForm.get('igst')?.clearValidators(); 
      // this.paymentDetailsForm.get('igst')?.updateValueAndValidity();
    } else {
      this.isIGSTDisabled = false;
      // this.paymentDetailsForm.get('igst')?.clearValidators(); 
      // this.paymentDetailsForm.get('igst')?.updateValueAndValidity();
    }
    const igst = this.paymentDetailsForm.get('igst')?.value || 0;
    const paymentAmount = this.paymentDetailsForm.get('paymentAmount')?.value || 0;

    const totalGSTPercentage = cgst + sgst + igst;
    const totalGSTAmount = (totalGSTPercentage / 100) * paymentAmount;
    const totalpaymentAmount = totalGSTAmount + paymentAmount;
    this.paymentDetailsForm.patchValue({
      // totalGST: totalGSTAmount.toFixed(2)
      totalGST: totalGSTPercentage,
      totalGSTAmount: totalGSTAmount.toFixed(2),
      amountWithGST: totalpaymentAmount.toFixed(2)
    });
  }

  checktotalAmount(): void {
    const paymentAmount = this.paymentDetailsForm.get('paymentAmount')?.value || 0;

    const cgst = this.paymentDetailsForm.get('cgst')?.value || 0;
    const igst = this.paymentDetailsForm.get('igst')?.value || 0;
    const sgst = this.paymentDetailsForm.get('sgst')?.value || 0;
    const totalGSTPercentage = cgst + sgst + igst;
    const totalGSTAmount = (totalGSTPercentage / 100) * paymentAmount;
    const totalpaymentAmount = totalGSTAmount + paymentAmount;
    this.paymentDetailsForm.patchValue({
      // totalGST: totalGSTAmount.toFixed(2)
      totalGST: totalGSTPercentage,
      totalGSTAmount: totalGSTAmount.toFixed(2),
      amountWithGST: totalpaymentAmount.toFixed(2)
    });

  }

  createPaymentDetails() {
    this.submitted = true;
    if (this.paymentDetailsForm.invalid) {
      return;
    }
    // const paymentDetails = this.paymentDetailsForm.value;
    const paymentDetails = {
      referenceNo: this.paymentDetailsForm.value.referenceNo,
      chequeNo: this.paymentDetailsForm.value.chequeNo,
      bankName: this.paymentDetailsForm.value.bankName,
      paymentDate: this.paymentDetailsForm.value.paymentDate,
      paymentAmount: this.paymentDetailsForm.value.paymentAmount,
      cgst: this.paymentDetailsForm.value.cgst,
      sgst: this.paymentDetailsForm.value.sgst,
      igst: this.paymentDetailsForm.value.igst,
      totalGST: this.paymentDetailsForm.value.totalGST,
      totalGSTAmount: this.paymentDetailsForm.value.totalGSTAmount,
      amountWithGST: this.paymentDetailsForm.value.amountWithGST
    };
    this.quoteOption.referenceNo = paymentDetails.referenceNo;
    this.quoteOption.chequeNo = paymentDetails.chequeNo;
    this.quoteOption.bankName = paymentDetails.bankName;
    this.quoteOption.paymentDate = paymentDetails.paymentDate;
    this.quoteOption.paymentAmount = paymentDetails.paymentAmount;
    this.quoteOption.cgst = paymentDetails.cgst
    this.quoteOption.sgst = paymentDetails.sgst
    this.quoteOption.igst = paymentDetails.igst
    this.quoteOption.totalGST = paymentDetails.totalGST
    this.quoteOption.totalGSTAmount = paymentDetails.totalGSTAmount
    this.quoteOption.amountWithGST = paymentDetails.amountWithGST
    console.log('Payment Details Submitted:', paymentDetails);
    this.gmcOptionsService.update(this.quoteOption._id, this.quoteOption).subscribe({
      next: (dto: IOneResponseDto<any>) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: 'Saved!',
          life: 3000
        })
      },
      error: (e) => {
        console.log(e)
      }
    })
  }
  cancelPaymentDetails() {
    this.paymentDetailsForm.reset();
  }

}
