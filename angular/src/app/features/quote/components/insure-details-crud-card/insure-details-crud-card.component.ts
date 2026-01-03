import { DatePipe, formatDate } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { IInsurerDetails, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-insure-details-crud-card',
  templateUrl: './insure-details-crud-card.component.html',
  styleUrls: ['./insure-details-crud-card.component.scss']
})
export class InsureDetailsCrudCardComponent implements OnInit {

  insuranceDetailForm: FormGroup;

  @Input() quote: IQuoteSlip

  today: string;

  targetPremiumChecked: any;
  quoteSubmissionDates: any;
  allInsuranceCompany:any = [];
  private currentQuote: Subscription;
  selectedInsurerDetails: any = [];

  constructor(
    private quoteService: QuoteService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quoteSubmissionDates = this.quote.quoteSubmissionDate ? String(quote?.quoteSubmissionDate).split('T')[0] : formatDate(new Date(), 'yyyy-MM-dd', 'en')
        this.targetPremiumChecked = this.quote.targetPremium ?? this.quote?.totalIndictiveQuoteAmt
        this.createInsuranceNameForm(quote);
      }
    })

  }

  ngOnInit(): void {
    // console.log(this.quote)
    this.quote = {...this.quote,insurerDetails:this.quote.insurerDetails.filter((val:any)=>val.share)}
    // console.log(this.quote)
    this.createInsuranceNameForm(this.quote);
    this.getAllCompanyDetails();
    
  }


  // ngOnDestroy(): void {
  //   this.currentQuote.unsubscribe();
  // }


  getAllCompanyDetails(){
    this.quoteService.getInsuranceCompanyMapping(this.quote._id).subscribe((res)=>{
      this.allInsuranceCompany = res.data.entities;
      // this.allInsuranceCompany = this.allInsuranceCompany.filter((ele)=> ele.name != 'Expired Term');

      // res.data.entities.map((val)=>{
      //   if(val.name == "Expired Term"){
      //     this.selectedInsurerDetails = val;

      //   }
      // })
    })

  }

  createInsuranceNameForm(quote?: IQuoteSlip) {
    quote = {...this.quote,insurerDetails:this.quote.insurerDetails.filter((val:any)=>val.share)}
    console.log(quote,"poooooo")
    this.insuranceDetailForm = this.formBuilder.group({
      insurerDetails: this.formBuilder.array(quote?.insurerDetails?.length > 0 ? quote?.insurerDetails.map((insurerDetail:IInsurerDetails) => this.createInsurerDetailsForm(insurerDetail)) : [this.createInsurerDetailsForm({name:"",share:null,sumInsured:null, isLeadInsurance:false})])
    })
    
  }

  submitInsuranceNameForm() {
    let totalSum = this.insuranceDetailForm.controls['insurerDetails'].value.reduce((acc:any,curr:any)=>{
      return acc = acc + parseInt(curr.sumInsured)
    },0)
    if(this.quote.totalQuoteSI != totalSum){
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail:'Shared should match 100%',
        life: 3000
      })

      return ;
    }
    // this.insuranceDetailForm.value.insurerDetails.push({name:this.selectedInsurerDetails});
      let payload = this.insuranceDetailForm.value
    this.quoteService.update(this.quote._id, payload).subscribe({
      next: (dto: IOneResponseDto<any>) => {
        this.quote = {...this.quote,insurerDetails:this.insuranceDetailForm.value}
        this.quoteService.setQuote(dto.data.entity.insurerDetails);
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




  get insurerDetails(): FormArray {
    return this.insuranceDetailForm.get("insurerDetails") as FormArray;
  };


  createInsurerDetailsForm(insurerDetail:IInsurerDetails): FormGroup {

    return this.formBuilder.group({
      name: [insurerDetail?.name[0]],
      share:[insurerDetail?.share, [Validators.pattern("[0-9]+"), Validators.required]],
      sumInsured:[insurerDetail?.sumInsured, [Validators.pattern("[0-9]+"), Validators.required]],
      isLeadInsurance: [insurerDetail?.isLeadInsurance]
    });
  };

  onAddHypothecation() {
    this.insurerDetails.push(this.createInsurerDetailsForm({name:'',share:null,sumInsured:null, isLeadInsurance:false}));
  }
  onDeleteHypothecation(rowIndex: number): void {
    this.insurerDetails.removeAt(rowIndex);
  }

  selectLeadInsurance(i){
    if(this.insurerDetails.controls[i].value['isLeadInsurance']){
      this.insurerDetails.controls.map((item, index) => {
        if(i != index) {
          item['controls']['isLeadInsurance'].setValue(false);
        }
      })
    }
  }

  onKey(event,index) 
  {
    const inputValue = parseInt(event.target.value);
    let sumInsuredValue = (this.quote.totalQuoteSI / 100) * inputValue;
    this.insurerDetails.controls[index].patchValue
    ({

      sumInsured:sumInsuredValue
    }
    
    )
  }


}
