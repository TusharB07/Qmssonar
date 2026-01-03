import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { IQuoteSlip, SubjectivityAndMajorExclusions } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-liability-exclusion-details',
  templateUrl: './liability-exclusion-details.component.html',
  styleUrls: ['./liability-exclusion-details.component.scss']
})
export class LiabilityExclusionDetailsComponent implements OnInit {
  optionsDataExclusion = [
    { label: 'Applicable', value: 'Applicable' },
    { label: 'Applicable with Carve Back', value: 'Applicable with Carve Back' },
    { label: 'Not Applicable', value: 'Not Applicable' }
  ];
  optionsDataSubjectivity = [
    { label: 'Applicable', value: 'Applicable' },
    { label: 'Not Applicable', value: 'Not Applicable' }
  ];
  quoteDandOOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  subjectivities:SubjectivityAndMajorExclusions[]=[]
  majorExclusions:SubjectivityAndMajorExclusions[]=[]
  private currentSelectedTemplate: Subscription;

  constructor(private quoteService: QuoteService,private liabilityTemplateService:liabilityTemplateService, private messageService: MessageService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quoteDandOOptions = this.quote?.liabilityTemplateDataId;
        this.subjectivities= this.quoteDandOOptions.subjectivity;
        this.majorExclusions=this.quoteDandOOptions.majorExclusions;
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteDandOOptions = template
        this.subjectivities= this.quoteDandOOptions.subjectivity;
        this.majorExclusions=this.quoteDandOOptions.majorExclusions;
       
      }
    })
   }

  ngOnInit(): void {
  }

  onCheckboxChange(data, event) {
    data.optionSelected = ""
    data.description = ""
  }

  onCheckboxChangeSubjectivity(data, event) {
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

  addmoreSubjectivity()
  {
    let subjectivites = new SubjectivityAndMajorExclusions();
    subjectivites.isExternal = true;
    const externalSubjectivites = this.subjectivities.filter(cover => cover.isExternal);
    const lastRecord= externalSubjectivites.pop();
    let subjectivitesId=0;
    if(lastRecord)
    {
      subjectivitesId= (+lastRecord.id) +1; ;
    }
    else
    {
      subjectivitesId=1;
    }
    subjectivites.id = subjectivitesId.toString();
    this.subjectivities.push(subjectivites)
  }

  save(){
    let checkedDuplicate = this.subjectivities.filter((cover, index, array) => 
      array.filter(c => c.name === cover.name).length > 1
    );
    if(checkedDuplicate.length>1 ){
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Error: Duplicate name of Subjectivities are not allowed`,
        detail: ``
      });
      return 
    }
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
    this.quoteDandOOptions.subjectivity=this.subjectivities;
    this.quoteDandOOptions.majorExclusions=this.majorExclusions;
    this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
      next: quote => {
          console.log("DANDO Added Successfully");
      },
      error: error => {
          console.log(error);
      }
  });
  }


  deleteSubjectivity(id)
  {
    this.subjectivities = this.subjectivities.filter(cover => cover.id != id);
  }

  deleteExclusions(id)
  {
    this.majorExclusions = this.majorExclusions.filter(cover => cover.id != id);
  }
}
