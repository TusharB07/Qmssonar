import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { IQuoteGmcTemplate } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-payment-detail-liability',
  templateUrl: './payment-detail-liability.component.html',
  styleUrls: ['./payment-detail-liability.component.scss']
})
export class PaymentDetailLiabilityComponent implements OnInit {

  @Input() quoteId: any;
  @Input() optionId: any;
  @Input() templateName: any;
  private currentQuote: Subscription;
  quoteOptionData: any
  templateData: any;
  isIGSTDisabled = false;
  isPendingPayment: boolean;
  pendingStatus: boolean;
  paymentPandingStatus: boolean;
  currentUser$: Observable<IUser>;
  paymentDetailsForm: FormGroup;
  submitted = false;
  fb: any;
  quoteOption: any
  quoteGmcOptionsLst: IQuoteGmcTemplate[]
  liabilityService : any
  template:any
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private quoteService: QuoteService,
    private accountService: AccountService,
    private dandocrimeTemplateService: liabilityTemplateService,
    private cglpublicService: liabilityCGLTemplateService,
    private cyberproductService: liabilityProductTemplateService,
    private eandoService: liabilityEandOTemplateService,
    private wcService: QuoteWcTemplateService,
  ) {
    this.template = this.config.data.templateName
    this.quoteId = this.config.data.quoteId;
    this.currentUser$ = this.accountService.currentUser$
    this.optionId = this.config?.data?.optionId;
    switch (this.template) {
      case AllowedProductTemplate.LIABILITY_CGL:
      case AllowedProductTemplate.LIABILITY_PUBLIC:
        this.liabilityService = cglpublicService
        break;
      case AllowedProductTemplate.LIABILITY_PRODUCT:
      case AllowedProductTemplate.LIABILITY_CYBER:
        this.liabilityService = cyberproductService
        break;
      case AllowedProductTemplate.LIABILITY:
      case AllowedProductTemplate.LIABILITY_CRIME:
        this.liabilityService = dandocrimeTemplateService
        break;
      case AllowedProductTemplate.LIABILITY_EANDO:
        this.liabilityService = eandoService
        break;
      case AllowedProductTemplate.WORKMENSCOMPENSATION:
        this.liabilityService = wcService
        break;
      default:
        console.error('Unsupported product template:', this.template);
        break;
    }
    console.log(this.config);
  }

  ngOnInit(): void {
    this.paymentDetailsForm = this.formBuilder.group({
      cgst: ['', [Validators.min(9)]],
      sgst: ['', [Validators.min(9)]],
      igst: ['',],
      totalGST: ['', Validators.required],
      totalGSTAmount: ['', Validators.required],
      amountWithGST: ['', Validators.required],
      referenceNo: [this.templateData?.referenceNo || '', Validators.required],
      chequeNo: [this.templateData?.chequeNo || '', Validators.required],
      bankName: [this.templateData?.bankName || '', Validators.required],
      paymentDate: [this.templateData?.paymentDate || '', Validators.required],
      paymentAmount: [
        this.templateData?.paymentAmount || 0,
        [Validators.required, Validators.min(0)]
      ]
    });
    this.quoteService.getAllLiabilityQuoteOptions(this.quoteId).subscribe({
      next: (dto: IOneResponseDto<any[]>) => {
        this.quoteOption = dto.data.entity.filter(x => x._id == this.optionId)[0];
        this.templateData = this.quoteOption
        this.paymentDetailsForm = this.formBuilder.group({
          cgst: ['', [Validators.min(9)]],
          sgst: ['', [Validators.min(9)]],
          igst: ['',],
          totalGST: ['', Validators.required],
          totalGSTAmount: ['', Validators.required],
          amountWithGST: ['', Validators.required],
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
    if (cgst || sgst) {
      this.isIGSTDisabled = true;
    } else {
      this.isIGSTDisabled = false;
    }
    const igst = this.paymentDetailsForm.get('igst')?.value || 0;
    const paymentAmount = this.paymentDetailsForm.get('paymentAmount')?.value || 0;

    const totalGSTPercentage = cgst + sgst + igst;
    const totalGSTAmount = (totalGSTPercentage / 100) * paymentAmount;
    const totalpaymentAmount = totalGSTAmount + paymentAmount;
    this.paymentDetailsForm.patchValue({
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
    this.liabilityService.update(this.templateData['_id'], paymentDetails).subscribe({
      next: (dto: IOneResponseDto<any>) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: 'Saved!',
          life: 3000
        })
        this.quoteService.refresh()
        this.ref.close();
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
