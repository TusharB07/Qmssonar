import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { Subscription } from 'rxjs';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IHypothication, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfigureDiscountDialogeComponent } from '../../../configure-discount-dialoge/configure-discount-dialoge.component';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { MoodysReviewDiscountDialogeComponent } from '../../../moodys-review-discount-dialoge/moodys-review-discount-dialoge.component';

@Component({
  selector: 'app-quote-insurer-review-decision-matrix-tab',
  templateUrl: './quote-insurer-review-decision-matrix-tab.component.html',
  styleUrls: ['./quote-insurer-review-decision-matrix-tab.component.scss']
})
export class QuoteInsurerReviewDecisionMatrixTabComponent implements OnInit {

  selectedExclusions: string[] = [];
  selectedDeductible;
  date3: Date;
  //   quoteId: string = '';
  quote: IQuoteSlip;
  selectedQuoteLocationOccpancyId: string;
  productType: any;

  private currentQuote: Subscription;

  private currentPropertyQuoteOption: Subscription;                      // New_Quote_option
  quoteOptionData: IQuoteOption                                          // New_Quote_option

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
    private quoteOptionService: QuoteOptionService,

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
        // this.createOtherDetailsForm(quote);
      }
    })

    // New_Quote_option
    this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
      next: (dto) => {
        this.quoteOptionData = dto
        this.createOtherDetailsForm(this.quoteOptionData);
      }
    });
  }

  ngOnInit(): void {
    // Old_Quote
    // this.createOtherDetailsForm(this.quote);
    // this.createBankDetailForm(this.quote.hypothications);

    // New_Quote_option
    this.createOtherDetailsForm(this.quoteOptionData);
    this.createBankDetailForm(this.quoteOptionData.hypothications);
  }



  // Old_Quote
  // createOtherDetailsForm(quote?: IQuoteSlip) {
  //   this.otherDetailsForm = this.formBuilder.group({
  //     deductiblesExcessPd: [quote?.deductiblesExcessPd,],
  //     // deductiblesExcessFlop: [quote?.deductiblesExcessFlop],
  //     // deductiblesExcessMblop: [quote?.deductiblesExcessMblop],
  //     brokerage: [quote?.brokerage],
  //     // rewards: [quote?.rewards],
  //     quoteSubmissionDate: [quote?.quoteSubmissionDate ? String(quote?.quoteSubmissionDate).split('T')[0] : null],
  //     targetPremium: [quote?.targetPremium],
  //     // existingBrokerCurrentYear: [quote?.existingBrokerCurrentYear],
  //     // preferredInsurer: [quote?.preferredInsurer],
  //     // otherTerms: [quote?.otherTerms],
  //     // additionalInfo: [quote?.additionalInfo],
  //   })


  // }

  // New_Quote_option
  createOtherDetailsForm(quoteOption?: IQuoteOption) {
    this.otherDetailsForm = this.formBuilder.group({
      deductiblesExcessPd: [quoteOption?.deductiblesExcessPd,],
      brokerage: [quoteOption?.brokerage],
      quoteSubmissionDate: [this.quote?.quoteSubmissionDate ? String(this.quote?.quoteSubmissionDate).split('T')[0] : null],
      targetPremium: [quoteOption?.targetPremium],
    })


  }

  createBankDetailForm(hypothications?: IHypothication[]) {
    this.bankDetailForm = this.formBuilder.group({
      name: [hypothications.map(hypothication => hypothication.name).join(', ')],
    })
  }

  submitOtherDetailsForm() {
    let payload = { ...this.otherDetailsForm.value };

    this.quoteService.update(this.quote._id, payload).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quoteService.setQuote(dto.data.entity);
      },
      error: (e) => {
        console.log(e)
      }
    })
  }
  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }

  opneConfigureDiscountDialoge() {

    const ref = this.dialogService.open(ConfigureDiscountDialogeComponent, {
      header: "Configure Discount",
      data: {
        // quoteId: this.quote._id,
        quote: this.quote,
        quoteOptionId: this.quoteOptionData._id

      },
      width: '30%',
      height: '60%',
      styleClass: "customPopup"
    })


    ref.onClose.subscribe(() => {
      this.quoteService.refresh()
    });
  }

  openmoddysConfigureDiscountDialoge() {

    const ref = this.dialogService.open(MoodysReviewDiscountDialogeComponent, {
      header: " Moody's review and Configure Discount",
      data: {
        // quoteId: this.quote._id,
        quote: this.quote,

      },
      width: '100%',
      height: '100%',
      styleClass: "customPopup"
    })


    ref.onClose.subscribe(() => {
      this.quoteService.refresh()
    });
  }

  submitBankDetailsForm() {
    let payload = { ...this.bankDetailForm.value };

    this.quoteService.update(this.quote._id, payload).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quoteService.setQuote(dto.data.entity);
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

}
