import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { GmcGradedSI, IQuoteSlip, IQuoteGmcTemplate, QuoteGmcTemplate } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { SumInsuredService } from 'src/app/features/admin/sumInsured/suminsured.service';
import { ToWords } from 'to-words';

@Component({
  selector: 'app-gmc-graded-si-dialog-rmunderwriterview',
  templateUrl: './gmc-graded-si-dialog-rmunderwriterview.component.html',
  styleUrls: ['./gmc-graded-si-dialog-rmunderwriterview.component.scss']
})
export class GmcGradedSiDialogRmunderwriterviewComponent implements OnInit {
  gmcGradedSI: GmcGradedSI = new GmcGradedSI();
  gmcGradedSILst: GmcGradedSI[] = [];
  quote: IQuoteSlip;
  optionsSumInsured: ILov[] = [];
  quoteGmcOptionsLst: IQuoteGmcTemplate[];
  quoteGmcOptions: IQuoteGmcTemplate;
  toWords = new ToWords();
  selectedQuoteTemplate: QuoteGmcTemplate = new QuoteGmcTemplate();
  optionIndex: number=0
  private currentQuote: Subscription;
  constructor(public config: DynamicDialogConfig, private quoteService: QuoteService, private sumInsuredService: SumInsuredService,
    private gmcQuoteTemplateService: QoutegmctemplateserviceService) {

    this.selectedQuoteTemplate = config.data.selectedQuoteTemplate
    this.optionIndex = config.data.optionIndex;
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
      console.log(this.optionIndex);
      }
    })
  }
  ngOnInit(): void {
    this.getOptions();
  }
  ConvertStringToNumber(input: any) {

    if (input != null && input != undefined) {
      if (input.label == null || input.label == undefined) {
        return 0;
      }
    }
    else {
      return 0;
    }

    if (input.label.trim().length == 0) {
      return 0;
    }
    let siamt = input.label.replace(/\D/g, '');
    return Number(siamt);
  }

  convertToWords(si: number) {
    let result = this.toWords.convert((si) ?? 0, {
      currency: true,
      ignoreZeroCurrency: true
    })
    return result;
  }
  getOptions() {
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.quoteGmcOptionsLst = dto.data.entity;
        if (this.quoteGmcOptionsLst.length > 0) {
          let optioname = "Option 1";
          this.quoteGmcOptions = this.quoteGmcOptionsLst.filter(x => x.optionIndex == this.optionIndex)[0];
          this.gmcGradedSILst = this.quoteGmcOptions.gmcGradedSILst;
          this.selectedQuoteTemplate = this.quoteGmcOptions
          //
          //Every time graded is clicked Grade will be fetched and 
          //this.gmcGradedSILst = dto.data.entity[0].gmcGradedSILst;
          // if (this.gmcGradedSILst.length == 0) {
          if (this.gmcGradedSILst.length == 0) {
            let distinctGrades = this.quote?.employeeDataId["employeeData"]
            let unique = [...new Set(this.quote?.employeeDataId["employeeData"].map(item => item.designation))];
            unique.forEach(element => {
              this.gmcGradedSI = new GmcGradedSI();
              this.gmcGradedSI.grade = element.toString();
              this.gmcGradedSILst.push(this.gmcGradedSI);
            });
          }

        }
      },
      error: e => {
        console.log(e);
      }
    });
  }
  disableButton() {
    if (this.gmcGradedSILst.some(x => x.siAmount == undefined)) {
      return true;
    }
    else {
      return false
    }

  }
  saveGrades() {

    const updatePayload = this.selectedQuoteTemplate
    this.gmcGradedSILst.forEach(element => {
      element.siAmount.label = element.siAmount.label.replace(/\D/g, '')
    });

    updatePayload.gmcGradedSILst = this.gmcGradedSILst;
    updatePayload.siType = "Graded";

    const max = this.gmcGradedSILst.reduce(function (prev, current) {
      return (+prev.siAmount.label > +current.siAmount.label) ? prev : current
    })
    updatePayload.siFlat = +max.siAmount.label.replace(/\D/g, '');
    this.gmcQuoteTemplateService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
      next: partner => {
        console.log("ttest");
      },
      error: error => {
        console.log(error);
      }
    });
  }

  searchOptionsSumInsured(event) {

    this.sumInsuredService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsSumInsured = data.data.entities.sort((n1, n2) => +n1.sumInsured - +n2.sumInsured).map(entity => ({ label: '₹ ' + Intl.NumberFormat('en-IN').format(+entity.sumInsured).toString(), value: entity._id }));
      },
      error: e => { }
    });
  };

}
