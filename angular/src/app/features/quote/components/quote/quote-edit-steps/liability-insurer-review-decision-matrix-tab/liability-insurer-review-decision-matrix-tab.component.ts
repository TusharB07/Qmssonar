import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { Subscription } from 'rxjs';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IHypothication, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfigureDiscountDialogeComponent } from '../../../configure-discount-dialoge/configure-discount-dialoge.component';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';

@Component({
  selector: 'app-liability-insurer-review-decision-matrix-tab',
  templateUrl: './liability-insurer-review-decision-matrix-tab.component.html',
  styleUrls: ['./liability-insurer-review-decision-matrix-tab.component.scss']
})
export class LiabilityInsurerReviewDecisionMatrixTabComponent implements OnInit {

  selectedExclusions: string[] = [];
  selectedDeductible;
  date3: Date;
//   quoteId: string = '';
  quote: IQuoteSlip;
  selectedQuoteLocationOccpancyId: string;
  productType : any;

  private currentQuote: Subscription;
  totalIndictiveQuoteAmt = 0
  deductible: ILov[] = [
    { label: '5% of Claims Amount', value: '' },
    { label: '10% of Claims Amount', value: '' },
    { label: '15% of Claims Amount', value: '' },
    { label: '20% of Claims Amount', value: '' },
  ]
  otherDetailsForm: any;
  bankDetailForm: any;

  constructor(

    private formBuilder: FormBuilder,

    private dialogService: DialogService,

    private router: Router,
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService,

    //private currentSelectedTemplate: Subscription

  ) {
    // this.quoteId = this.activatedRoute.parent.snapshot.paramMap.get("quote_id");

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote
      }
    });
    this.productType = this.quote?.productId

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
          this.quote = quote
          this.totalIndictiveQuoteAmt = this.getPremiumValue()
          this.createOtherDetailsForm(quote);
      }
  })

  // this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
  //   next: (template) => {
  //     this.totalIndictiveQuoteAmt = this.getPremiumValue()
  //   }
  // })
  }
  getPremiumValue(): number {
    switch (this.quote.productId?.['productTemplate']) {
      case AllowedProductTemplate.WORKMENSCOMPENSATION:
        return this.quote.wcTemplateDataId?.['indicativePremium'] ?? 0;
      case AllowedProductTemplate.LIABILITY:
      case AllowedProductTemplate.LIABILITY_CRIME:
        return this.quote.liabilityTemplateDataId?.['totalPremiumAmt'] ?? 0;
      case AllowedProductTemplate.LIABILITY_EANDO:
        return this.quote.liabilityEandOTemplateDataId?.['totalPremiumAmt'] ?? 0;
      case AllowedProductTemplate.LIABILITY_CGL:
      case AllowedProductTemplate.LIABILITY_PUBLIC:
        return this.quote.liabilityCGLTemplateDataId?.['totalPremiumAmt'] ?? 0;
      case AllowedProductTemplate.LIABILITY_PRODUCT:
      case AllowedProductTemplate.LIABILITY_CYBER:
        return this.quote.liabilityProductTemplateDataId?.['totalPremiumAmt'] ?? 0;
      default:
        return 0;
    }
}
  ngOnInit(): void {
    console.log(this.quote)
    this.createOtherDetailsForm(this.quote);
    this.createBankDetailForm(this.quote.hypothications);
  }




  createOtherDetailsForm(quote?: IQuoteSlip) {
    this.otherDetailsForm = this.formBuilder.group({
        deductiblesExcessPd: [quote?.deductiblesExcessPd,],
        // deductiblesExcessFlop: [quote?.deductiblesExcessFlop],
        // deductiblesExcessMblop: [quote?.deductiblesExcessMblop],
        brokerage: [quote?.brokerage],
        // rewards: [quote?.rewards],
        quoteSubmissionDate: [quote?.quoteSubmissionDate ? String(quote?.quoteSubmissionDate).split('T')[0] : null],
        targetPremium: [quote?.targetPremium],
        // existingBrokerCurrentYear: [quote?.existingBrokerCurrentYear],
        // preferredInsurer: [quote?.preferredInsurer],
        // otherTerms: [quote?.otherTerms],
        // additionalInfo: [quote?.additionalInfo],
    })


}



// createBankDetailForm() {
//   this.bankDetailForm = this.formBuilder.group({
//       bankName: [null],
//       bankName2: [null],
//   })
// }
createBankDetailForm(hypothications?: IHypothication[]) {
  this.bankDetailForm = this.formBuilder.group({
    hypothication: [hypothications.map(hypothication => hypothication.name).join(', ')],
  })
}

submitOtherDetailsForm() {
  console.log(this.otherDetailsForm)

  let payload = { ...this.otherDetailsForm.value };

  this.quoteService.update(this.quote._id, payload).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
          this.quoteService.setQuote(dto.data.entity);
          console.log(this.quote)
      },
      error: (e) => {
          console.log(e)
      }
  })
}
  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }

//   previousPage() {
//     this.router.navigateByUrl(`backend/quotes/${this.quoteId}/edit/warrenties`);
//   }
//   nextPage() {
//     this.router.navigateByUrl(`backend/quotes/${this.quoteId}/edit/preview`);
//   }


opneConfigureDiscountDialoge() {

  const ref = this.dialogService.open(ConfigureDiscountDialogeComponent, {
      header: "Configure Discount",
      data: {
          // quoteId: this.quote._id,
          quote: this.quote,

      },
      width: '30%',
      height: '60%',
      styleClass: "customPopup"
  })


  ref.onClose.subscribe(() => {
      this.quoteService.refresh()
  });
}

}
