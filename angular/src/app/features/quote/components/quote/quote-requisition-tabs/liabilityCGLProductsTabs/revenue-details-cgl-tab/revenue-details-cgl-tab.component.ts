import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedQuoteStates, IQuoteSlip, TurnOverDetails, TurnOverRows } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { LiabilityCGLAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-cgl-addoncovers-dialog/liability-cgl-addoncovers-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { IndicativePremiumCalcService } from '../../workmen-coverages-tab/indicativepremiumcalc.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { AllowedBreakup } from 'src/app/features/quote/pages/quote-view-page/quote-view-page.component';
import { MessageService } from 'primeng/api';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-revenue-details-cgl-tab',
  templateUrl: './revenue-details-cgl-tab.component.html',
  styleUrls: ['./revenue-details-cgl-tab.component.scss']
})
export class TurnoverDetailsandClaimExperienceTabComponent implements OnInit, OnChanges {
  quoteCGLOptions: any;
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  selectedCoversCount: number = 0
  currentUser$: Observable<IUser>;
  templateName: string = ""
  deductibilitiesCount: number = 0
  cols: ILov[] = [
    { value: 'period', label: 'Period/Locations' },
    { value: 'firstYear', label: '' },
    { value: 'secondyear', label: '' },
    { value: 'thirdYear', label: '' },
    { value: 'fourthYear', label: '' },
    { value: 'fifthYear', label: '' },
    { value: 'EstForNextYear', label: 'Est for next year' },
  ];
  rows: ILov[] = [
    { value: 'india', label: 'India' },
    { value: 'unitedKingdom', label: 'United Kingdom' },
    { value: 'europe', label: 'Europe' },
    { value: 'usaCanada', label: 'USA/Canada' },
    { value: 'ROW', label: 'ROW (Rest of World)' },
    { value: 'total', label: 'Total' },
  ];

  colsPL: ILov[] = [
    { value: 'period', label: 'Period/Locations' },
    { value: 'firstYear', label: '' },
    { value: 'secondyear', label: '' },
    { value: 'thirdYear', label: '' },
    { value: 'fourthYear', label: '' },
    { value: 'fifthYear', label: '' },
    { value: 'EstForNextYear', label: 'Est for next year' },
  ];
  rowsPL: ILov[] = [
    { value: 'india', label: 'India' },
  ];

  optionsBreakup = [
    { label: 'Revenue', code: AllowedBreakup.REVENUE },
    { label: 'Turnover', code: AllowedBreakup.TURNOVER },
  ];

  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  constructor(private dialogService: DialogService, private messageService: MessageService, private indicativePremiumCalcService: IndicativePremiumCalcService, private accountService: AccountService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityCGLTemplateService: liabilityCGLTemplateService,
  ) {
    this.currentUser$ = this.accountService.currentUser$
    this.updateYears()
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
      //   this.quoteCGLOptions = this.quote?.liabilityCGLTemplateDataId;
      //   this.quoteCGLOptions.retroactiveDate = new Date(this.quoteCGLOptions.retroactiveDate)
      //   let liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
      //   this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
      //   //RevenueDetails turnOverDetails
      //   if (!this.quoteCGLOptions.turnOverDetails) {
      //     if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {

      //       this.quoteCGLOptions.turnOverDetails = new TurnOverDetails();
      //       this.quoteCGLOptions.turnOverDetails.revenueColumn = this.cols;
      //       this.rows.forEach(element => {
      //         var data = new TurnOverRows();
      //         data.label = element.label;
      //         data.name = element.value;
      //         data.firstYear = 0;
      //         data.secondYear = 0;
      //         data.thirdYear = 0;
      //         data.fourthYear = 0;
      //         data.fifthYear = 0;
      //         data.estimatedForNextYear = 0;
      //         this.quoteCGLOptions.turnOverDetails.revenueRows.push(data);
      //       });
      //     }
      //     else {
      //       this.quoteCGLOptions.turnOverDetails = new TurnOverDetails();
      //       this.quoteCGLOptions.turnOverDetails.revenueColumn = this.colsPL;
      //       this.rowsPL.forEach(element => {
      //         var data = new TurnOverRows();
      //         data.label = element.label;
      //         data.name = element.value;
      //         data.firstYear = 0;
      //         data.secondYear = 0;
      //         data.thirdYear = 0;
      //         data.fourthYear = 0;
      //         data.fifthYear = 0;
      //         data.estimatedForNextYear = 0;
      //         this.quoteCGLOptions.turnOverDetails.revenueRows.push(data);
      //       });
      //     }
      //   }
      //   else {

      //   }

      //   if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
      //     this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCGLPremium(this.quoteCGLOptions.limitOfLiabilityCGL)
      //     this.deductibilitiesCount = 0;
      //     this.deductibilitiesCount = this.quoteCGLOptions.deductibles.length;
      //   }
      //   else {
      //     this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculatePublicLiabilityPremium(this.quoteCGLOptions.limitOfLiabilityCGL)
      //   }
       }
    })


    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.quoteCGLOptions = temp
        this.quoteCGLOptions.retroactiveDate = new Date(this.quoteCGLOptions.retroactiveDate)
        let liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
        this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        //RevenueDetails turnOverDetails
        if (!this.quoteCGLOptions.turnOverDetails) {
          if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
            this.quoteCGLOptions.turnOverDetails = new TurnOverDetails();
            this.quoteCGLOptions.turnOverDetails.revenueColumn = this.cols;
            this.rows.forEach(element => {
              var data = new TurnOverRows();
              data.label = element.label;
              data.name = element.value;
              data.firstYear = 0;
              data.secondYear = 0;
              data.thirdYear = 0;
              data.fourthYear = 0;
              data.fifthYear = 0;
              data.estimatedForNextYear = 0;
              this.quoteCGLOptions.turnOverDetails.revenueRows.push(data);
            });
          }
          else {
            this.quoteCGLOptions.turnOverDetails = new TurnOverDetails();
            this.quoteCGLOptions.turnOverDetails.revenueColumn = this.colsPL;
            this.rowsPL.forEach(element => {
              var data = new TurnOverRows();
              data.label = element.label;
              data.name = element.value;
              data.firstYear = 0;
              data.secondYear = 0;
              data.thirdYear = 0;
              data.fourthYear = 0;
              data.fifthYear = 0;
              data.estimatedForNextYear = 0;
              this.quoteCGLOptions.turnOverDetails.revenueRows.push(data);
            });
          }
        }
        else {

        }

        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
          this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCGLPremium(this.quoteCGLOptions.limitOfLiability)
          this.deductibilitiesCount = 0;
          this.deductibilitiesCount = this.quoteCGLOptions.liabiltyDeductibles.length;
        }
        else {
          this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculatePublicLiabilityPremium(this.quoteCGLOptions.limitOfLiabilityCGL)
        }
      
      }
    })
  }

  changeView($event) {
    this.quoteCGLOptions.isBreakupRevenueORTurnover = $event
  }

  getTotalfirstYear() {
    const firstYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.firstYear;
    }, 0);
    return firstYear;
  }

  getTotalsecondYear() {
    const secondYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.secondYear;
    }, 0);
    return secondYear;
  }

  getTotalthirdYear() {
    const thirdYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.thirdYear;
    }, 0);
    return thirdYear;
  }
  getTotalfourthYear() {
    const fourthYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.fourthYear;
    }, 0);
    return fourthYear;
  }

  getTotalfifthYear() {
    const fifthYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.fifthYear;
    }, 0);
    return fifthYear;
  }
  getTotalestimatedForNextYear() {
    const estimatedForNextYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.estimatedForNextYear;
      ;
    }, 0);
    return estimatedForNextYear;
  }

  updateYears() {
    const currentYear = new Date().getFullYear();
    this.cols[5].label = currentYear.toString();
    this.cols[4].label = (currentYear - 1).toString();
    this.cols[3].label = (currentYear - 2).toString();
    this.cols[2].label = (currentYear - 3).toString();
    this.cols[1].label = (currentYear - 4).toString();

    this.colsPL[5].label = currentYear.toString();
    this.colsPL[4].label = (currentYear - 1).toString();
    this.colsPL[3].label = (currentYear - 2).toString();
    this.colsPL[2].label = (currentYear - 3).toString();
    this.colsPL[1].label = (currentYear - 4).toString();
  }


  predictNextYear(region: string, year: number): number {
    // Implement prediction logic using the prediction service
    // Example:
    // return this.predictionService.predictNextYear(region, year);
    // You would implement the logic in the PredictionService
    // and call it here passing the region and year
    return 0; // Placeholder, replace with actual logic
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {

  }
  save() {
    //this.quote.quoteState=AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE
    if (this.quoteCGLOptions.turnOverDetails.revenueRows.some(row => !row.label || row.label.trim() === '')) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `One or more revenue rows have missing or invalid country names. Please ensure all labels are properly filled out`
      });
      return;
    }
    console.log(this.quoteCGLOptions.turnOverDetails)
    let updatePayloadQuote = this.quote;
    this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
      next: quote => {
        this.liabilityCGLTemplateService.updateArray(this.quoteCGLOptions._id, this.quoteCGLOptions).subscribe({
          next: quote => {
            console.log("CGl Added Successfully");
            this.quoteService.refresh(() => {
            })
          },
          error: error => {
            console.log(error);
          }
        });
        this.quoteService.refresh(() => {
        })
      },
      error: error => {
        console.log(error);
      }
    });

  }

  removeLastComma(str: string): string {
    if (str.trim().endsWith(',')) {
      return str.slice(0, -1);
    }
    return str;
  }

  loadquoteDetails() {
    this.quoteService.get(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quoteService.setQuote(dto.data.entity)
      },
      error: e => {
        console.log(e);
      }
    });

  }

  openFlexaCoversDialog() {
    const ref = this.dialogService.open(LiabilityCGLAddoncoversDialogComponent, {
      header: "Add-on Covers",
      width: '70%',
      styleClass: 'customPopup',
      closable: false,
      closeOnEscape: false,
      data: {
        quote: this.quote,
        covers: this.quoteCGLOptions.liabiltyCovers,
        quoteCGLOptions: this.quoteCGLOptions
      }
    }).onClose.subscribe((selectedCovers) => {
      //this.loadquoteDetails()
      this.selectedCoversCount = selectedCovers
    })


  }
}

