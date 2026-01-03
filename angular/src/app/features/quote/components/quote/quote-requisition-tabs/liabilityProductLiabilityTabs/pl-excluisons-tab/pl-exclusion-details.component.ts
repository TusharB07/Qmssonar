import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { IQuoteSlip, SubjectivityAndMajorExclusions } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-pl-exclusion-details',
  templateUrl: './pl-exclusion-details.component.html',
  styleUrls: ['./pl-exclusion-details.component.scss']
})
export class ProductliabilityExclusionDetailsComponent implements OnInit {
  optionsData = [
    { label: 'Applicable', value: 'Applicable' },
    { label: 'Applicable with Carve Back', value: 'Applicable with Carve Back' },
    { label: 'Not Applicable', value: 'Not Applicable' }
  ];
  quotePLOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  majorExclusions:SubjectivityAndMajorExclusions[]=[]
  private currentSelectedTemplate: Subscription;

  constructor(private quoteService: QuoteService,private liabilityProductTemplateService:liabilityProductTemplateService, private messageService: MessageService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
      this.quote = quote
        this.quotePLOptions = this.quote?.liabilityProductTemplateDataId;
        this.majorExclusions=this.quotePLOptions.majorExclusions;
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quotePLOptions = template;
        this.majorExclusions=this.quotePLOptions.majorExclusions;
      }
      
    })
   }

  ngOnInit(): void {
  }

 onCheckboxChange(data, event) {
    data.optionSelected = ""
    data.description = ""
  }


  addmoreExclusions()
  {
    let exclusion = new SubjectivityAndMajorExclusions();
    exclusion.isExternal = true;
    const externalExclusions = this.majorExclusions.filter(cover => cover.isExternal);
    const lastRecord= externalExclusions.pop();

    let externalexclusionsId=0;
    if(lastRecord)
    {
      externalexclusionsId= (+lastRecord.id) +1; ;
    }
    else
    {
      externalexclusionsId=1;
    }
    exclusion.id = externalexclusionsId.toString();
    this.majorExclusions.push(exclusion)
  }


  save(){
    //let checkedDataExclusions = this.majorExclusions.filter(x => x.isSelected == true)
    let checkedDuplicateExclusions = this.majorExclusions.filter((cover, index, array) => 
      array.filter(c => c.name === cover.name).length > 1
    );
    if(checkedDuplicateExclusions.length>1 ){
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Error: Duplicate name of Exclusions are not allowed`,
        detail: ``
      });
      return 
    }
    // if (checkedDataExclusions.some(x => x.optionSelected == "" || x.name == "")) {
    //   this.messageService.add({
    //     key: "error",
    //     severity: "error",
    //     summary: `Error: Select all options of checked Exclusions`,
    //     detail: `Select all options of checked Exclusions`
    //   });
    //   this.majorExclusions.forEach(cover => {
    //     if (cover.optionSelected === "") {
    //       cover.isSelected = false;
    //     }
    //   });
    //   this.majorExclusions=[...this.majorExclusions]
    //   return;
    // }
    this.quotePLOptions.majorExclusions=this.majorExclusions;
    this.liabilityProductTemplateService.updateArray(this.quotePLOptions._id, this.quotePLOptions).subscribe({
      next: quote => {
          console.log("PL Added Successfully");
      },
      error: error => {
          console.log(error);
      }
  });
  }


  deleteExclusions(id)
  {
    this.majorExclusions = this.majorExclusions.filter(cover => cover.id != id);
  }
}
