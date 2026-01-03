import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { IQuoteSlip, SubjectivityAndMajorExclusions } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-exclusion-eando-details',
  templateUrl: './eando-exclusion-details.component.html',
  styleUrls: ['./eando-exclusion-details.component.scss']
})
export class EandOExclusionDetailsComponent implements OnInit {


  optionsData = [
    { label: 'Applicable', value: 'Applicable' },
    { label: 'Applicable with Carve Back', value: 'Applicable with Carve Back' },
    { label: 'Not Applicable', value: 'Not Applicable' }
  ];
  private currentSelectedTemplate: Subscription;

  quoteEandOOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  subjectivities: SubjectivityAndMajorExclusions[] = []
  majorExclusions: SubjectivityAndMajorExclusions[] = []
  constructor(private quoteService: QuoteService, private liabilityEandOTemplateService: liabilityEandOTemplateService, private messageService: MessageService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quoteEandOOptions = this.quote?.liabilityEandOTemplateDataId;
        this.subjectivities = this.quoteEandOOptions.subjectivity;
        this.majorExclusions = this.quoteEandOOptions.majorExclusions;
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteEandOOptions = template
        this.subjectivities = this.quoteEandOOptions.subjectivity;
        this.majorExclusions = this.quoteEandOOptions.majorExclusions;
      }
    })
  }

  ngOnInit(): void {
  }

  loadQuoteOption(templateId: string) {
    this.liabilityEandOTemplateService.get(templateId).subscribe({
      next: quoteLiablitity => {
        this.quoteEandOOptions = quoteLiablitity.data.entity;
        this.subjectivities = this.quoteEandOOptions.subjectivity;
        this.majorExclusions = this.quoteEandOOptions.majorExclusions;

      },
      error: e => {
        console.log(e);
      }
    });
  }
  onCheckboxChange(data, event) {
    data.optionSelected = ""
    data.description = ""
  }

  onCheckboxChangeSubjectivity(data, event) {
    data.optionSelected = ""
    data.description = ""
  }


  addmoreExclusions() {
    let exclusion = new SubjectivityAndMajorExclusions();
    exclusion.isExternal = true;
    const externalExclusions = this.majorExclusions.filter(cover => cover.isExternal);
    const lastRecord = externalExclusions.pop();

    let externalexclusionsId = 0;
    if (lastRecord) {
      externalexclusionsId = (+lastRecord.id) + 1;;
    }
    else {
      externalexclusionsId = 1;
    }
    exclusion.id = externalexclusionsId.toString();
    this.majorExclusions.push(exclusion)
  }

  addmoreSubjectivity() {
    let subjectivites = new SubjectivityAndMajorExclusions();
    subjectivites.isExternal = true;
    const externalSubjectivites = this.subjectivities.filter(cover => cover.isExternal);
    const lastRecord = externalSubjectivites.pop();
    let subjectivitesId = 0;
    if (lastRecord) {
      subjectivitesId = (+lastRecord.id) + 1;;
    }
    else {
      subjectivitesId = 1;
    }
    subjectivites.id = subjectivitesId.toString();
    this.subjectivities.push(subjectivites)
  }

  save() {
    //let checkedData = this.subjectivities.filter(x => x.isSelected == true)
    let checkedDuplicate = this.subjectivities.filter((cover, index, array) =>
      array.filter(c => c.name === cover.name).length > 1
    );
    if (checkedDuplicate.length > 1) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Error: Duplicate name of Subjectivities are not allowed`,
        detail: ``
      });
      return
    }
    // if (checkedData.some(x => x.optionSelected == "" || x.name == "")) {
    //   this.messageService.add({
    //     key: "error",
    //     severity: "error",
    //     summary: `Error: Select all options of checked Subjectivities`,
    //     detail: `Select all options of checked Subjectivities`
    //   });
    //   this.subjectivities.forEach(cover => {
    //     if (cover.optionSelected === "") {
    //       cover.isSelected = false;
    //     }
    //   });
    //   this.subjectivities = [...this.subjectivities]
    //   return;
    // }
    //let checkedDataExclusions = this.majorExclusions.filter(x => x.isSelected == true)
    let checkedDuplicateExclusions = this.majorExclusions.filter((cover, index, array) =>
      array.filter(c => c.name === cover.name).length > 1
    );
    if (checkedDuplicateExclusions.length > 1) {
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
    //   this.majorExclusions = [...this.majorExclusions]
    //   return;
    // }
    this.quoteEandOOptions.subjectivity = this.subjectivities;
    this.quoteEandOOptions.majorExclusions = this.majorExclusions;
    this.liabilityEandOTemplateService.updateArray(this.quoteEandOOptions._id, this.quoteEandOOptions).subscribe({
      next: quote => {
        console.log("E&O Added Successfully");
      },
      error: error => {
        console.log(error);
      }
    });
  }

  deleteSubjectivity(id) {
    this.subjectivities = this.subjectivities.filter(cover => cover.id != id);
  }

  deleteExclusions(id) {
    this.majorExclusions = this.majorExclusions.filter(cover => cover.id != id);
  }
}
