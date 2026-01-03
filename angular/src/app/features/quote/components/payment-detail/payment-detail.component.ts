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
import { IQuoteOption, IQuoteSlip, ProductLiabilityTemplate } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {

  @Input() quote: any;
  private currentQuote: Subscription;
  quoteOptionData: IQuoteOption

  isPendingPayment: boolean;
  pendingStatus: boolean;
  paymentPandingStatus: boolean;
  currentUser$: Observable<IUser>;
  isIGSTDisabled = false;
  quoteOption: IQuoteOption
  paymentDetailsForm: FormGroup;
  submitted = false;
  fb: any;
  template: string = "";
  templateData: any;
  liabilityService: any;
  isLiabilityProduct: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private quoteOptionService: QuoteOptionService,
    private messageService: MessageService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private quoteService: QuoteService,
    private dialogService: DialogService,
    private accountService: AccountService,
    private cglTemplateService: liabilityCGLTemplateService,
    private wcTemplateService : QuoteWcTemplateService,
    private liabilityTemplateService: liabilityTemplateService,
    private eandoTemplateService : liabilityEandOTemplateService,
    private productTemplateService : liabilityProductTemplateService


  ) {

    this.quote = this.config.data.quote;
    console.log(this.quote);
    this.currentUser$ = this.accountService.currentUser$
    this.quoteOption = this.config?.data?.quoteOption;
    if (this.quote?.productId) {
      this.template = this.quote?.productId["productTemplate"]
      switch (this.template) {
        case AllowedProductTemplate.LIABILITY_CGL:
        case AllowedProductTemplate.LIABILITY_PUBLIC:
          this.isLiabilityProduct = true;
          this.templateData = this.quote.liabilityCGLTemplateDataId
          this.liabilityService = cglTemplateService
          break;
        case AllowedProductTemplate.LIABILITY_PRODUCT:
        case AllowedProductTemplate.LIABILITY_CYBER:
          this.isLiabilityProduct = true;
          this.templateData = this.quote.liabilityProductTemplateDataId
          this.liabilityService = productTemplateService
          break;
        case AllowedProductTemplate.LIABILITY:
        case AllowedProductTemplate.LIABILITY_CRIME:
          this.isLiabilityProduct = true;
          this.templateData = this.quote.liabilityTemplateDataId
          this.liabilityService = liabilityTemplateService
          break;
        case AllowedProductTemplate.LIABILITY_EANDO:
          this.isLiabilityProduct = true;
          this.templateData = this.quote.liabilityEandOTemplateDataId
          this.liabilityService = eandoTemplateService
          break;
        case AllowedProductTemplate.WORKMENSCOMPENSATION:
          this.isLiabilityProduct = true;
          this.templateData = this.quote.wcTemplateDataId
          this.liabilityService = wcTemplateService
          break;
        default:
          this.templateData = this.quote
          console.error('Unsupported product template:', this.template);
          break;
      }

    }
    console.log(this.config);
  }

  ngOnInit(): void {
    this.quote = this.config.data.quote;
    this.templateData = this.quote
    this.paymentDetailsForm = this.formBuilder.group({
      // referenceNo: ['', Validators.required],
      // chequeNo: ['', Validators.required],
      // bankName: ['', Validators.required],
      // paymentDate: ['', Validators.required],
      // paymentAmount: ['', [Validators.required, Validators.min(0)]],
      cgst: [this.templateData?.cgst || '',[Validators.min(9),Validators.max(100)] ],
      sgst: [this.templateData?.sgst || '', [Validators.min(9),Validators.max(100)]],
      igst: [this.templateData?.igst || '',[Validators.max(100)]],
      totalGST: [this.templateData?.totalGST || '', Validators.required], // Adding the totalGST field
      // totalGSTPercentage: ['', Validators.required], // Total GST Percentage field
      totalGSTAmount: [this.templateData?.totalGSTAmount || '', Validators.required], // Total GST Amount field
      amountWithGST: [this.templateData?.amountWithGST || '', Validators.required], // Amount with GST field
      referenceNo: [this.templateData?.referenceNo || '', Validators.required],
      chequeNo: [this.templateData?.chequeNo || '', Validators.required],
      bankName: [this.templateData?.bankName || '', Validators.required],
      paymentDate: [this.templateData?.paymentDate || '', Validators.required],
      paymentAmount: [
        this.templateData?.paymentAmount || 0,
        [Validators.required, Validators.min(0)]
      ]
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
      totalGSTAmount:totalGSTAmount.toFixed(2),
      amountWithGST:totalpaymentAmount.toFixed(2)
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
      totalGSTAmount:totalGSTAmount.toFixed(2),
      amountWithGST:totalpaymentAmount.toFixed(2)
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
    console.log('Payment Details Submitted:', paymentDetails);
    if (this.isLiabilityProduct) {
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
    } else {
      this.quoteOptionService.update(this.quote._id, paymentDetails).subscribe({
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


  }

  cancelPaymentDetails() {
    this.paymentDetailsForm.reset();
  }

  restrictInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value + event.key);
    if (value > 100) {
      event.preventDefault();
    }
  }

}
