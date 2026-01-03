import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { DANDOTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-exclusion-subjectivity-details-tab',
  templateUrl: './exclusion-subjectivity-details-tab.component.html',
  styleUrls: ['./exclusion-subjectivity-details-tab.component.scss']
})
export class ExclusionSubjectivityDetailsTabComponent implements OnInit {
  dropdownOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' }
  ];
  selectedOption: string;

  exclusions = [
    { label: 'Exclusion 1', checked: false },
    { label: 'Exclusion 2', checked: false },
    { label: 'Exclusion 3', checked: false }
  ];

  majorExclusions = [
    { label: 'Applicable', value: 'Applicable' },
    { label: 'Applicable with Carve Back', value: 'Applicable with Carve Back' },
    { label: 'Not Applicable', value: 'Not Applicable' }
  ];
  quoteDandOOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;

  constructor(private quoteService: QuoteService,private liabilityTemplateService:liabilityTemplateService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quoteDandOOptions = this.quote?.liabilityTemplateDataId;

      }
    })
   }

  ngOnInit(): void {
  }
  save(){
    this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
      next: quote => {
          console.log("DANDO Added Successfully");
      },
      error: error => {
          console.log(error);
      }
  });
  }
}
