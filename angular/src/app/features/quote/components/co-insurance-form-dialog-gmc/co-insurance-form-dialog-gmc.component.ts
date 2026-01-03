import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IOneResponseDto } from 'src/app/app.model';
import { IcoInsurers, IQuoteSlip, IQuoteOption, IQuoteGmcTemplate } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { GmcOptionsService } from '../gmc-coverages-options-dialog/gmc-options.service';

@Component({
  selector: 'app-co-insurance-form-dialog-gmc',
  templateUrl: './co-insurance-form-dialog-gmc.component.html',
  styleUrls: ['./co-insurance-form-dialog-gmc.component.scss']
})
export class CoInsuranceFormDialogGmcComponent implements OnInit {
  coInsurers: IcoInsurers[] = []
  coInsurerForm: FormGroup;
  quote: IQuoteSlip
  @Input() quoteId: any;
  @Input() optionId: any;
  quoteOption: IQuoteGmcTemplate

  constructor(
    private formBuilder: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private quoteService: QuoteService,
    private messageService: MessageService,
    private gmcOptionsService: GmcOptionsService,
  ) {
    this.quoteId = this.config.data?.quoteId;
    this.optionId = this.config.data?.quoteOptionData;
    console.log(this.quote);
    
  }

  ngOnInit(): void {

    // Old_Quote
    // this.coBrokers = this.quote?.coBrokers
    // this.createFormGroup(this.quote?.coBrokers);

    // New_Quote_Option
    
    this.createFormGroup(this.quoteOption?.coInsurers);
  }

  getOptions() {
    this.quoteService.getAllQuoteOptions(this.quoteId).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.quoteOption = dto.data.entity.filter(x=>x._id == this.optionId)[0];
        this.coInsurers = this.quoteOption?.coInsurers
      },
      error: e => {
        console.log(e);
      }
    });
  }
  
  createFormGroup(items: IcoInsurers[]) {
    this.coInsurerForm = this.formBuilder.group({
      // If has item creates form for each either just creates one blank form
      formArray: this.formBuilder.array(items?.length > 0 ? items.map((item: IcoInsurers) => this.createForm(item)) : [this.createForm()]),
    });
  }

  createForm(item?: IcoInsurers): FormGroup {
    return this.formBuilder.group({
      companyName: [item?.companyName, [Validators.required]],
      share: [item?.share ?? 0, [Validators.required, Validators.min(1), Validators.max(100)]],
      cityOfIssuingOffice:[item?.cityOfIssuingOffice, [Validators.required]],
      isLead:[item?.isLead, [Validators.required]],
      divisionOffice:[item?.divisionOffice, [Validators.required]],
    });
  }

  get formArray(): FormArray {
    return this.coInsurerForm.get("formArray") as FormArray;
  }

  addFormToArray(): void {
    this.formArray.push(this.createForm());
  }

  deleteFormBasedOnIndex(rowIndex: number): void {
    this.formArray.removeAt(rowIndex);
  }


  onSharePercentageChange(form: FormGroup, index: number): void {
    console.log(form);    
    const shareControl = form.controls.share;
    if (shareControl.value > 100) {
      shareControl.setValue(100); 
      shareControl.markAsTouched();
    }
  }

  submitCoInsurerForm() {
    console.log("i am in submitcoinsurerform");
    let payload = {
      isCoInsurer: true,
      coInsurance: this.formArray.value
    }
    if (this.coInsurerForm.valid) {
      // Old_Quote
      // this.quoteService.update(this.quote._id, payload).subscribe({
      //   next: (dto: IOneResponseDto<IQuoteSlip>) => {
      this.quoteOption.isCoInsurer = true;
      this.quoteOption.coInsurers= this.formArray.value
      // New_Quote_Option
      this.gmcOptionsService.update(this.quoteOption._id, payload).subscribe({
        next: (dto: IOneResponseDto<any>) => {
          this.messageService.add({
            severity: "success",
            summary: "Saved!",
            life: 3000
          });
          // this.quoteService.refresh();          
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
