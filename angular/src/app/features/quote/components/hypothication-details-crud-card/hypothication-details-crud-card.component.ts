import { DatePipe, formatDate } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { IHypothication, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
  selector: 'app-hypothication-details-crud-card',
  templateUrl: './hypothication-details-crud-card.component.html',
  styleUrls: ['./hypothication-details-crud-card.component.scss']
})
export class HypothicationDetailsCrudCardComponent implements OnInit, OnDestroy {

  bankDetailForm: FormGroup;

  @Input() quote: IQuoteSlip

  today: string;

  targetPremiumChecked: any;
  quoteSubmissionDates: any;
  isMobile: boolean = false;

  @Input() quoteOptionData: IQuoteOption    // New_Quote_Option
  private currentPropertyQuoteOption: Subscription;       // New_Quote_option

  private currentQuote: Subscription;

  constructor(
    private quoteService: QuoteService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private deviceService: DeviceDetectorService,
    private messageService: MessageService,
    private quoteOptionService: QuoteOptionService,
  ) {
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quoteSubmissionDates = this.quote.quoteSubmissionDate ? String(quote?.quoteSubmissionDate).split('T')[0] : formatDate(new Date(), 'yyyy-MM-dd', 'en')
        // this.targetPremiumChecked = this.quote.targetPremium ?? this.quote?.totalIndictiveQuoteAmt
        // this.createBankDetailForm(quote);
      }
    })

    // New_Quote_option
    this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
      next: (dto: IQuoteOption) => {
        this.quoteOptionData = dto
        this.targetPremiumChecked = this.quoteOptionData?.targetPremium ?? this.quoteOptionData?.totalIndictiveQuoteAmt
        this.createBankDetailForm(this.quoteOptionData);

      }
    });
  }

  ngOnInit(): void {
    // this.createBankDetailForm(this.quote);                       // Old_Quote
    this.createBankDetailForm(this.quoteOptionData);                          // New_Quote_option
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }

  // Old_Quote
  // createBankDetailForm(quote?: IQuoteSlip) {
  //   this.bankDetailForm = this.formBuilder.group({
  //     // hypothication: [quote?.hypothication],
  //     hypothications: this.formBuilder.array(quote?.hypothications?.length > 0 ? quote?.hypothications.map((hypothication: IHypothication) => this.createHypothicationForm(hypothication)) : [this.createHypothicationForm()]),
  //   })
  // }

  // New_Quote_option
  createBankDetailForm(quoteOption?: IQuoteOption) {
    this.bankDetailForm = this.formBuilder.group({
      // hypothication: [quote?.hypothication],
      hypothications: this.formBuilder.array(quoteOption?.hypothications?.length > 0 ? quoteOption?.hypothications.map((hypothication: IHypothication) => this.createHypothicationForm(hypothication)) : [this.createHypothicationForm()]),

    })
  }

  submitHypothicationForm() {

    let payload = { ...this.bankDetailForm.value };
    // Old_Quote
    // this.quoteService.update(this.quote._id, payload).subscribe({
    // New_Quote_option
    this.quoteOptionService.update(this.quoteOptionData._id, payload).subscribe({
      next: (dto: IOneResponseDto<any>) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail:'Saved!',
          life: 3000
        })
      },
      error: (e) => {
        console.log(e)
      }
    })
  }




  get hypothications(): FormArray {
    return this.bankDetailForm.get("hypothications") as FormArray;
  };


  createHypothicationForm(hypothication?: IHypothication): FormGroup {

    return this.formBuilder.group({
      name: [hypothication?.name, [Validators.pattern("^[a-zA-Z -']+"), Validators.required]],
      isLeadBank: [hypothication?.isLeadBank]
    });
  };

  onAddHypothecation() {
    this.hypothications.push(this.createHypothicationForm());
  }
  onDeleteHypothecation(rowIndex: number): void {
    this.hypothications.removeAt(rowIndex);
  }

  selectLeadbank(i) {
    if (this.hypothications.controls[i].value['isLeadBank']) {
      this.hypothications.controls.map((item, index) => {
        if (i != index) {
          item['controls']['isLeadBank'].setValue(false);
        }
      })
    }
  }


}
