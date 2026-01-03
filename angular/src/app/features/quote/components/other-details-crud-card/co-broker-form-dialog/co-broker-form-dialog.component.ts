import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IOneResponseDto } from 'src/app/app.model';
import { ICoBroker, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
  selector: 'app-co-broker-form-dialog',
  templateUrl: './co-broker-form-dialog.component.html',
  styleUrls: ['./co-broker-form-dialog.component.scss']
})
export class CoBrokerFormDialogComponent implements OnInit {

  coBrokers: ICoBroker[] = []
  coBrokerForm: FormGroup;
  quote: IQuoteSlip

  quoteOptionData: IQuoteOption                                 // New_Quote_Option

  constructor(
    private formBuilder: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private quoteService: QuoteService,
    private messageService: MessageService,
    private quoteOptionService: QuoteOptionService,
  ) {
    this.quote = this.config.data?.quote;
    this.quoteOptionData = this.config.data?.quoteOptionData;
  }

  ngOnInit(): void {

    // Old_Quote
    // this.coBrokers = this.quote?.coBrokers
    // this.createFormGroup(this.quote?.coBrokers);

    // New_Quote_Option
    this.coBrokers = this.quoteOptionData?.coBrokers
    this.createFormGroup(this.quoteOptionData?.coBrokers);
  }

  createFormGroup(items: ICoBroker[]) {
    this.coBrokerForm = this.formBuilder.group({
      // If has item creates form for each either just creates one blank form
      formArray: this.formBuilder.array(items?.length > 0 ? items.map((item: ICoBroker) => this.createForm(item)) : [this.createForm()]),
    });
  }

  createForm(item?: ICoBroker): FormGroup {
    return this.formBuilder.group({
      companyName: [item?.companyName, [Validators.required]],
      share: [item?.share ?? 0, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  get formArray(): FormArray {
    return this.coBrokerForm.get("formArray") as FormArray;
  }

  addFormToArray(): void {
    this.formArray.push(this.createForm());
  }

  deleteFormBasedOnIndex(rowIndex: number): void {
    this.formArray.removeAt(rowIndex);
  }

  submitCoBrokerForm() {
    let payload = {
      isCobroker: true,
      coBrokers: this.formArray.value
    }
    if (this.coBrokerForm.valid) {
      // Old_Quote
      // this.quoteService.update(this.quote._id, payload).subscribe({
      //   next: (dto: IOneResponseDto<IQuoteSlip>) => {

      // New_Quote_Option
      this.quoteOptionService.update(this.quoteOptionData._id, payload).subscribe({
        next: (dto: IOneResponseDto<IQuoteOption>) => {
          this.messageService.add({
            severity: "success",
            summary: "Saved!",
            life: 3000
          });
          // this.quoteService.refresh();
          this.quoteOptionService.refreshQuoteOption();
          this.ref.close()
        },
        error: (e) => {
          console.log(e)
        }
      })
    }
  }

  cancel() {
    this.ref.close()
  }

}
