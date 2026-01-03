import { Component, OnInit, SimpleChanges } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription, Observable } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { IQuoteSlip, RevenueDetails, RevenueRows } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { LiabilityAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-addoncovers-dialog/liability-addoncovers-dialog.component';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { IndicativePremiumCalcService } from '../../workmen-coverages-tab/indicativepremiumcalc.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { AllowedBreakup } from 'src/app/features/quote/pages/quote-view-page/quote-view-page.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-revenue-details-tab',
  templateUrl: './revenue-details-tab.component.html',
  styleUrls: ['./revenue-details-tab.component.scss']
})
export class RevenueDetailsTabComponent implements OnInit {
  quoteDndOOptions: any;
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  selectedCoversCount: number = 0
  currentUser$: Observable<IUser>;
  deductibilitiesCount: number = 0

  optionsBreakup = [
    { label: 'Revenue', code: AllowedBreakup.REVENUE },
    { label: 'Turnover', code: AllowedBreakup.TURNOVER },
  ];

  cols: ILov[] = [
    { value: 'period', label: 'Period/Location' },
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
  templateName: string = ""
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  constructor(private dialogService: DialogService, private messageService: MessageService, private indicativePremiumCalcService: IndicativePremiumCalcService, private accountService: AccountService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityTemplateService: liabilityTemplateService,
  ) {
    this.currentUser$ = this.accountService.currentUser$
    this.updateYears()
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
        // this.quoteDndOOptions = this.quote?.liabilityTemplateDataId;
        // this.quoteDndOOptions.retroactiveDate = new Date(this.quoteDndOOptions.retroactiveDate)
        // let liabiltyCovers = this.quoteDndOOptions.liabiltyCovers
        // this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        // this.deductibilitiesCount = 0
        // if(!this.quoteDndOOptions.liabiltyDeductibles)
        //   {
        //     this.quoteDndOOptions.liabiltyDeductibles=[];
        //   }
        //   this.deductibilitiesCount = this.quoteDndOOptions.liabiltyDeductibles.filter(x => x.isSelected == true).length;
        // //RevenueDetails revenueDetails
        // if(!this.quoteDndOOptions.revenueDetails)
        // {
        //   this.quoteDndOOptions.revenueDetails=new RevenueDetails();
        //   this.quoteDndOOptions.revenueDetails.revenueColumn=this.cols;
        //   this.rows.forEach(element => {
        //     var data=new RevenueRows();
        //     data.label=element.label;
        //     data.name=element.value;
        //     data.firstYear= 0;
        //     data.secondYear= 0;
        //     data.thirdYear= 0;
        //     data.fourthYear= 0;
        //     data.fifthYear= 0;
        //     data.estimatedForNextYear= 0;
        //     this.quoteDndOOptions.revenueDetails.revenueRows.push(data);
        //   });
        // }
        // else
        // {

        // }



        // if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY) {
        //   this.quoteDndOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateDandOPremium(this.limitOfLiability)
        // }
        // else {
        //   this.quoteDndOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCrimeInsurancePremium(this.limitOfLiability)

        // }
      }
    })

    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.quoteDndOOptions = temp;
        this.quoteDndOOptions.retroactiveDate = new Date(this.quoteDndOOptions.retroactiveDate)
        let liabiltyCovers = this.quoteDndOOptions.liabiltyCovers
        this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        this.deductibilitiesCount = 0
        if (!this.quoteDndOOptions.liabiltyDeductibles) {
          this.quoteDndOOptions.liabiltyDeductibles = [];
        }
        this.deductibilitiesCount = this.quoteDndOOptions.liabiltyDeductibles.filter(x => x.isSelected == true).length;
        //RevenueDetails revenueDetails
        if (!this.quoteDndOOptions.revenueDetails) {
          this.quoteDndOOptions.revenueDetails = new RevenueDetails();
          this.quoteDndOOptions.revenueDetails.revenueColumn = this.cols;
          this.rows.forEach(element => {
            var data = new RevenueRows();
            data.label = element.label;
            data.name = element.value;
            data.firstYear = 0;
            data.secondYear = 0;
            data.thirdYear = 0;
            data.fourthYear = 0;
            data.fifthYear = 0;
            data.estimatedForNextYear = 0;
            this.quoteDndOOptions.revenueDetails.revenueRows.push(data);
          });
        }
        else {

        }



        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY) {
          this.quoteDndOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateDandOPremium(this.quoteDndOOptions.limitOfLiability)
        }
        else {
          this.quoteDndOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCrimeInsurancePremium(this.quoteDndOOptions.limitOfLiability)

        }
      }
    })
  }

  changeView($event) {
    this.quoteDndOOptions.isBreakupRevenueORTurnover = $event
  }

  getTotalfirstYear() {
    const firstYear = this.quoteDndOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.firstYear;
    }, 0);
    return firstYear;
  }

  getTotalsecondYear() {
    const secondYear = this.quoteDndOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.secondYear;
    }, 0);
    return secondYear;
  }

  getTotalthirdYear() {
    const thirdYear = this.quoteDndOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.thirdYear;
    }, 0);
    return thirdYear;
  }

  getTotalfourthYear() {
    const fourthYear = this.quoteDndOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.fourthYear;
    }, 0);
    return fourthYear;
  }

  getTotalfifthYear() {
    const fifthYear = this.quoteDndOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.fifthYear;
    }, 0);
    return fifthYear;
  }

  getTotalestimatedForNextYear() {
    const estimatedForNextYear = this.quoteDndOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
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
    if (this.quoteDndOOptions.revenueDetails.revenueRows.some(row => !row.label || row.label.trim() === '')) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `One or more revenue rows have missing or invalid country names. Please ensure all labels are properly filled out`
      });
      return;
    }
    let updatePayloadQuote = this.quote;
    this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
      next: quote => {
        this.liabilityTemplateService.updateArray(this.quoteDndOOptions._id, this.quoteDndOOptions).subscribe({
          next: quote => {
            console.log("E&O Added Successfully");
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
    const ref = this.dialogService.open(LiabilityAddoncoversDialogComponent, {
      header: "Add-on Covers",
      width: '70%',
      styleClass: 'customPopup',
      closable: false,
      closeOnEscape: false,
      data: {
        quote: this.quote,
        covers: this.quoteDndOOptions.liabiltyCovers,
        quoteDndOOptions: this.quoteDndOOptions
      }
    }).onClose.subscribe((selectedCovers) => {
      //this.loadquoteDetails()
      this.selectedCoversCount = selectedCovers
    })


  }

}
