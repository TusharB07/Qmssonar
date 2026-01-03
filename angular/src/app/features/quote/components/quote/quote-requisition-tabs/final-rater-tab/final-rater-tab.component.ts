import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { FinalRater, IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-final-rater-tab',
  templateUrl: './final-rater-tab.component.html',
  styleUrls: ['./final-rater-tab.component.scss']
})
export class FinalRaterTabComponent implements OnInit {
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  private currentSelectedTemplate: Subscription;
  selectedQuoteTemplate: IQuoteGmcTemplate;
  quoteGmcOptionsLst: IQuoteGmcTemplate[];
  finalRater: FinalRater = new FinalRater()
  constructor(private quoteService: QuoteService, private qoutegmctemplateserviceService: QoutegmctemplateserviceService, private gmcQuoteTemplateService: QoutegmctemplateserviceService, private messageService: MessageService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        // console.log(this.quote);

      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.selectedQuoteTemplate = template;
        this.finalRater = template.finalRater;
        if (this.finalRater == undefined) {
          this.finalRater = new FinalRater();
        }
        this.calculateNetClaimAmount();
        this.calculateNetTotalAmount();
        this.calculateGrossTotalAmount();
        this.calculateInvestmentAmount();
        this.calculatePremium();

      }
    })
  }
  calculateNetClaimAmount() {
    this.finalRater.netClaimAmount = +this.finalRater.claimsPaidOutStanding - +this.finalRater.oneTimeClaims - +this.finalRater.covidClaims - +this.finalRater.claimsDuetoDeathOfEmployee;
    console.log("NetClaimAmount- " + this.finalRater.netClaimAmount);
    this.calculateNetTotalAmount();
    this.calculateGrossTotalAmount();
    this.calculateInvestmentAmount();
    this.calculatePremium();
  }

  calculateNetTotalAmount() {
    let adjustment = +this.finalRater.netClaimAmount * (+this.finalRater.adjustmentpercentage / 100)
    let ibnr = +this.finalRater.netClaimAmount * (+this.finalRater.ibnr / 100)
    let medicalInflation = +this.finalRater.netClaimAmount * (+this.finalRater.medicalInflation / 100)
    console.log("adjustment- " + adjustment);
    console.log("ibnr- " + ibnr);
    console.log("medicalInflation- " + medicalInflation);
    console.log("TotalALl- " + (+adjustment + +ibnr + +medicalInflation));
    this.finalRater.netToatlAmount = (+adjustment + +ibnr + +medicalInflation) + this.finalRater.netClaimAmount;
    console.log("netToatlAmount- " + this.finalRater.netToatlAmount);
    this.calculateGrossTotalAmount();
    this.calculateInvestmentAmount();
    this.calculatePremium();
  }

  calculateGrossTotalAmount() {
    let loading = +this.finalRater.netToatlAmount * (+this.finalRater.tpaLoading / 100)
    let brokarage = +this.finalRater.netToatlAmount * (+this.finalRater.brokerage / 100)
    let margin = +this.finalRater.netToatlAmount * (+this.finalRater.insurerMargin / 100)
    console.log("loading- " + loading);
    console.log("brokarage- " + brokarage);
    console.log("margin- " + margin);
    console.log("TotalALl- " + (+loading + +brokarage + +margin));
    this.finalRater.netGrossTotalAmount = (+loading + +brokarage + +margin) + this.finalRater.netToatlAmount;
    console.log("netGrossTotalAmount- " + this.finalRater.netGrossTotalAmount);
    this.calculateInvestmentAmount();
    this.calculatePremium();
  }

  calculateInvestmentAmount() {
    let amount = +this.finalRater.netGrossTotalAmount * (+this.finalRater.investmentIncome / 100)
    console.log("InvestmentAmount- " + amount);
    this.finalRater.insurrerIncomeAmount = +this.finalRater.netGrossTotalAmount - amount
    console.log("insurrerIncomeAmount- " + this.finalRater.insurrerIncomeAmount);
    this.calculatePremium();
  }

  calculatePremium() {
    this.finalRater.grandTotalAmount = 0
    let amount = +this.finalRater.insurrerIncomeAmount * (+this.finalRater.overAllLoadingDiscount / 100)
    let discAmount = this.finalRater.insurrerIncomeAmount - amount
    console.log("discAmount- " + discAmount);
    this.finalRater.grandTotalAmount = discAmount
    console.log("grandTotalAmount- " + this.finalRater.grandTotalAmount);
  }
  ngOnInit(): void {


  }
  // saveTabs() {
  //   const updatePayload = this.selectedQuoteTemplate
  //   updatePayload.finalRater = this.finalRater
  //   this.gmcQuoteTemplateService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
  //     next: partner => {
  //       console.log("ttest");
  //     },
  //     error: error => {
  //       console.log(error);
  //     }
  //   });
  // }

  loadQuoteDetails(qoute_id) {
    this.quoteService.get(qoute_id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quote = dto.data.entity;
        this.getOptions();
      },
      error: e => {
        console.log(e);
        //this.DemographyFileuploaded();
      }
    });
  }
  getOptions() {
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.loadOptionsData(dto.data.entity);
        this.loadSelectedOption(dto.data.entity.filter(x => x.optionName == this.selectedQuoteTemplate.optionName)[0])
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadOptionsData(quoteOption: IQuoteGmcTemplate[]) {
    this.quoteService.setQuoteOptions(quoteOption)
  }

  loadSelectedOption(quoteOption: IQuoteGmcTemplate) {
    this.quoteService.setSelectedOptions(quoteOption)
  }
  saveTabs() {
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.quoteGmcOptionsLst = dto.data.entity;
        this.quoteGmcOptionsLst.forEach(element => {
          element.finalRater = this.finalRater
          this.qoutegmctemplateserviceService.updateArray(element._id, element).subscribe({
            next: quote => {
              //this.quote = quote.data.entity;
              // 
              // this.messageService.add({
              //   severity: "success",
              //   summary: "Successful",
              //   detail: `Saved`,
              //   life: 3000
              // });
              //If GMC master Create Template
              this.loadQuoteDetails(this.quote._id);
            },
            error: error => {
              console.log(error);
            }
          });
        });

      },
      error: e => {
        console.log(e);
      }
    });



  }
}
