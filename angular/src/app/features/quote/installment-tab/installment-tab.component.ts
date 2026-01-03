import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IQuoteOption, IQuoteSlip } from '../../admin/quote/quote.model';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { InstallmentService } from './installment.service';
import { Iinstallment } from './installment.model';
import { IOneResponseDto } from 'src/app/app.model';

@Component({
  selector: 'app-installment-tab',
  templateUrl: './installment-tab.component.html',
  styleUrls: ['./installment-tab.component.scss']
})
export class InstallmentTabComponent implements OnInit {

  installmentForm!: FormGroup;
  installments: any[] = [];
  @Input() quote: IQuoteSlip;
  @Input() quoteOptionData: IQuoteOption;
  installmentDetailsData:Iinstallment;

  constructor(private fb: FormBuilder,
              private installmentService:InstallmentService,
              private messageService:MessageService) {
  }

  ngOnInit(): void {
    this.updateInstallments();
    this.getInstallment();
    this.createForm()
    this.installmentForm.get('installmentSchedule')?.valueChanges.subscribe((value) => {
      if (value === 'no') {
        this.clearInstallments();
      } else if (value === 'yes') {
        this.updateInstallments();
      }
    });
  }
  createForm(item?: Iinstallment): void {
    this.installmentForm = this.fb.group({
      installmentSchedule: [item?.isInstallmentScheduled ? 'yes' : 'no'],
      numberOfInstallments: [item?.numberOfInstallments || 0],
      installments: this.fb.array([]),
    });
  
    if (item?.installments?.length > 0) {
      this.installments = item?.installments;
  
      const formArray = this.installmentForm?.get('installments') as FormArray;
      item.installments.forEach((installment, index) => {
        const formattedDate = installment?.installmentDate ? new Date(installment.installmentDate).toISOString().split('T')[0] : null;
  
        formArray.push(
          this.fb.group({
            installmentNumber: [installment?.installmentNumber, Validators.required],
            installmentDate: [installment?.installmentDate, Validators.required],
            installmentAmount: [installment?.installmentAmount, Validators.required],
          })
        );
  
        // Dynamically add controls for each installment
        const premiumControlName = `installmentPremium${index}`;
        const dateControlName = `installmentDate${index}`;
  
        this.installmentForm.addControl(
          premiumControlName,
          new FormControl(installment?.installmentAmount, Validators.required)
        );
        this.installmentForm.addControl(
          dateControlName,
          new FormControl(formattedDate, Validators.required)
        );
      });
    }
    console.log(item?.installments);
  }
  

  updateInstallments(): void {
    if (!this.installmentForm) {
      console.error('Form is not initialized.');
      return;
    }
  
    const numberOfInstallmentsControl = this.installmentForm.get('numberOfInstallments');
    if (!numberOfInstallmentsControl) {
      console.error('Control "numberOfInstallments" does not exist in the form.');
      return;
    }
  
    const count = numberOfInstallmentsControl.value || 0;
    this.installments = Array(count).fill(null);
  
    const formArray = this.installmentForm.get('installments') as FormArray;
  
    // Dynamically add or remove controls for each installment
    while (formArray.length < count) {
      formArray.push(
        this.fb.group({
          installmentNumber: [formArray.length + 1, Validators.required],
          installmentDate: ['', Validators.required],
          installmentAmount: ['', Validators.required],
        })
      );
    }
  
    while (formArray.length > count) {
      formArray.removeAt(formArray.length - 1);
    }
  
    // Dynamically create form controls for premium and date
    for (let i = 0; i < count; i++) {
      const premiumControlName = `installmentPremium${i}`;
      const dateControlName = `installmentDate${i}`;
  
      if (!this.installmentForm.contains(premiumControlName)) {
        this.installmentForm.addControl(
          premiumControlName,
          new FormControl('', Validators.required)
        );
      }
  
      if (!this.installmentForm.contains(dateControlName)) {
        this.installmentForm.addControl(
          dateControlName,
          new FormControl('', Validators.required)
        );
      }
    }
  }
  
  
  

  getOrdinalSuffix(n: number): string {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  clearInstallments(): void {
    this.installments = [];
    Object.keys(this.installmentForm.controls).forEach((controlName) => {
      if (controlName.startsWith('installmentPremium') || controlName.startsWith('installmentDate')) {
        this.installmentForm.removeControl(controlName);
      }
    });
  }


  onSubmit() {
    console.log(this.installmentDetailsData);
      if (this.installmentDetailsData) {
        const formValues = this.installmentForm.value;
        const installments = this.installments.map((_, index) => ({
          numberOfInstallments: this.installments.length,
          installmentNumber: index + 1,
          installmentAmount: parseFloat(formValues[`installmentPremium${index}`]),
          installmentDate: formValues[`installmentDate${index}`]
        }));
          const payload = {installments}
          payload["quoteId"] = this.quote?._id
          payload["quoteOptionId"] = this.quoteOptionData?._id

          this.installmentService.update(this.installmentDetailsData?._id, payload).subscribe({
              next: (response: IOneResponseDto<Iinstallment>) => {
                  this.messageService.add({
                      severity: "success",
                      summary: "Successful",
                      detail: `Saved!`,
                      life: 3000
                  });
              }, error: error => {
              }
          });
        }else{
          const formValues = this.installmentForm.value;
      
          const installments = this.installments.map((_, index) => ({
            numberOfInstallments: this.installments.length,
            installmentNumber: index + 1,
            installmentAmount: parseFloat(formValues[`installmentPremium${index}`]),
            installmentDate: formValues[`installmentDate${index}`]
          }));
          
          const payload = {
            quoteId: this.quote?._id,
            quoteOptionId: this.quoteOptionData?._id,
            isInstallmentScheduled: formValues.installmentSchedule === 'yes',
            numberOfInstallments: this.installments.length,
            installments: installments
          };
        
          this.installmentService.create(payload).subscribe({
            next: () => {
              this.getInstallment();
          }, error: error => {
          }
          })
        }
  }
  getInstallment(){
    console.log(this.quoteOptionData)
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
          // @ts-ignore
          quoteOptionId: [
              {
                  value: this.quoteOptionData._id,
                  matchMode: "equals",
                  operator: "and"
              }
          ]
      },
      globalFilter: null,
      multiSortMeta: null
  }
    this.installmentService.getMany(lazyLoadEvent).subscribe({
      next: (dto: IOneResponseDto<Iinstallment>) => {
        if (dto.data?.entities[0]?._id) {
          this.installmentDetailsData = dto.data?.entities[0]
        }
        this.createForm(dto.data.entities[0]);
      },
      error: e => {
        console.log(e);
      }
    });
  }
}
