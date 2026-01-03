import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IOneResponseDto } from 'src/app/app.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { IcoInsurers, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';


@Component({
  selector: 'app-co-insurance-form-dialog',
  templateUrl: './co-insurance-form-dialog.component.html',
  styleUrls: ['./co-insurance-form-dialog.component.scss']
})
export class CoInsuranceFormDialogComponent implements OnInit {

  coInsurers: IcoInsurers[] = []
  coInsurerForm: FormGroup;
  quote: IQuoteSlip

  quoteOptionData: IQuoteOption                                 // New_Quote_Option
  template: string = "";
  templateData: any;
  liabilityService: any;
  isLiabilityProduct: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private quoteService: QuoteService,
    private messageService: MessageService,
    private quoteOptionService: QuoteOptionService,
    private cglTemplateService: liabilityCGLTemplateService,
    private wcTemplateService: QuoteWcTemplateService,
    private liabilityTemplateService: liabilityTemplateService,
    private eandoTemplateService: liabilityEandOTemplateService,
    private productTemplateService: liabilityProductTemplateService
  ) {
    this.quote = this.config.data?.quote;
    this.quoteOptionData = this.config.data?.quoteOptionData;
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
          console.error('Unsupported product template:', this.template);
          break;
      }

    }
    console.log(this.quote);

  }

  ngOnInit(): void {

    // Old_Quote
    // this.coBrokers = this.quote?.coBrokers
    // this.createFormGroup(this.quote?.coBrokers);

    // New_Quote_Option
    if (this.isLiabilityProduct) {
      this.coInsurers = this.templateData?.coInsurers
      this.createFormGroup(this.templateData?.coInsurers);
    } else {
      this.coInsurers = this.quoteOptionData?.coInsurers
      this.createFormGroup(this.quoteOptionData?.coInsurers);
    }

  }

  createFormGroup(items: IcoInsurers[]) {
    this.coInsurerForm = this.formBuilder.group({
      formArray: this.formBuilder.array(
        items?.length > 0 ? items.map((item: IcoInsurers) => this.createForm(item)) : [this.createForm()],
        { validators: [this.atLeastOneLeadValidator] }
      ),
    });
  }

  createForm(item?: IcoInsurers): FormGroup {
    return this.formBuilder.group({
      companyName: [item?.companyName, [Validators.required]],
      share: [item?.share ?? 0, [Validators.required, Validators.min(1), Validators.max(100)]],
      cityOfIssuingOffice: [item?.cityOfIssuingOffice, [Validators.required]],
      isLead: [item?.isLead],
      divisionOffice: [item?.divisionOffice, [Validators.required]],
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
    const shareControl = form.controls.share;
    if (shareControl.value > 100) {
      shareControl.setValue(100);
      shareControl.markAsTouched();
    }
    this.adjustSharePercentage();
  }

  adjustSharePercentage(): void {
    const totalShare = this.formArray.controls.reduce((sum, form) => sum + form.value.share, 0);
    if (totalShare > 100) {
      const lastForm = this.formArray.at(this.formArray.length - 1);
      const excess = totalShare - 100;
      const newShare = lastForm.get('share')?.value - excess;
      lastForm.get('share')?.setValue(newShare);
    }
  }
  atLeastOneLeadValidator(formArray: FormArray): { [key: string]: boolean } | null {
    const hasLead = formArray.controls.some((control: AbstractControl) => control.value.isLead === true);
    console.log('hasLead:', hasLead); 
    return hasLead ? null : { atLeastOneLead: true };
  }


  submitCoInsurerForm() {
    console.log("i am in submitcoinsurerform");

 

    if (!this.isTotalShareValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The total share percentage must be 100%.',
        life: 3000
      });
      return;
    }

    if (this.coInsurerForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'At least one co-insurer must be the lead.',
        life: 3000
      });
      return;
    }


    let payload = {
      isCoInsurer: true,
      coInsurers: this.formArray.value
    }
    if (this.coInsurerForm.valid) {
      // Old_Quote
      // this.quoteService.update(this.quote._id, payload).subscribe({
      //   next: (dto: IOneResponseDto<IQuoteSlip>) => {

      // New_Quote_Option
      if (this.isLiabilityProduct) {
        this.liabilityService.update(this.templateData['_id'], payload).subscribe({
          next: (dto: IOneResponseDto<any>) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: 'Saved!',
              life: 3000
            })
            this.ref.close();
            this.quoteService.refresh()
          },
          error: (e) => {
            console.log(e)
          }
        })
      } else {
        this.quoteOptionService.update(this.quote._id, payload).subscribe({
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
  }

  cancel() {
    this.ref.close()
  }


  isTotalShareValid(): boolean {
    const totalShare = this.formArray.controls.reduce((sum, form) => sum + form.value.share, 0);
    return totalShare === 100;
  }

}
