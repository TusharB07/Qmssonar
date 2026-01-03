import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AllowedQuoteStates, IQuoteSlip, TurnOverDetails, TurnOverRows } from 'src/app/features/admin/quote/quote.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { IndicativePremiumCalcService } from '../../workmen-coverages-tab/indicativepremiumcalc.service';
import { AccountService } from 'src/app/features/account/account.service';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { LiabilityProductliabilityAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-productliability-addoncovers-dialog/liability-productliability-addoncovers-dialog.component';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { AllowedBreakup, AllowedQuoteView } from 'src/app/features/quote/pages/quote-view-page/quote-view-page.component';

@Component({
  selector: 'app-revenue-details-pl-tab',
  templateUrl: './revenue-details-pl-tab.component.html',
  styleUrls: ['./revenue-details-pl-tab.component.scss']
})
export class RevenueDetailsProductliabilityTabComponent implements OnInit, OnChanges {
  quotePLOptions: any;
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  selectedCoversCount: number = 0
  currentUser$: Observable<IUser>;
  deductibilitiesCount: number = 0
    templateName:string=""
  cols: ILov[] = [
    { value: 'period', label: 'Period/Locations' },
    { value: 'firstYear', label: '' },
    { value: 'secondyear', label: '' },
    { value: 'thirdYear', label: '' },
    { value: 'EstForNextYear', label: 'Est for next year' },
  ];
  rows: ILov[] = [
      { value: 'india', label: 'India' },
      { value: 'unitedKingdom', label: 'United Kingdom' },
      { value: 'europe', label: 'Europe' },
      { value: 'usaCanada', label: 'USA/Canada' },
      {value: 'ROW', label : 'ROW (Rest of World)'},
      { value: 'total', label: 'Total' },
  ];
  optionsBreakup = [
    { label: 'Revenue', code: AllowedBreakup.REVENUE },
    { label: 'Turnover', code: AllowedBreakup.TURNOVER},
  ];
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  constructor(private dialogService: DialogService, private indicativePremiumCalcService:IndicativePremiumCalcService, private accountService: AccountService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityProductTemplateService: liabilityProductTemplateService,
  ) {
    this.currentUser$ = this.accountService.currentUser$
    this.updateYears()
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
        // this.quotePLOptions = this.quote?.liabilityProductTemplateDataId;
        // this.quotePLOptions.retroactiveDate = new Date(this.quotePLOptions.retroactiveDate)
        // let liabiltyCovers = this.quotePLOptions.liabiltyCovers
        // this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        // this.deductibilitiesCount = 0
        // this.deductibilitiesCount = this.quotePLOptions.deductibles.length;

        // //RevenueDetails turnOverDetails
        // if(!this.quotePLOptions.turnOverDetails)
        // {
        //   this.quotePLOptions.turnOverDetails=new TurnOverDetails();
        //   this.quotePLOptions.turnOverDetails.revenueColumn=this.cols;
        //   this.rows.forEach(element => {
        //     var data=new TurnOverRows();
        //     data.label=element.label;
        //     data.name=element.value;
        //     data.firstYear= 0;
        //     data.secondYear= 0;
        //     data.thirdYear= 0;
        //     data.estimatedForNextYear= 0;
        //     this.quotePLOptions.turnOverDetails.revenueRows.push(data);
        //   });
        // }
        // else
        // {

        // }

        // if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT) {
        //   this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateProductLiabilityPremium(this.quoteCGLOptions.limitOfLiabilityProduct)
        // }
        // else {
        //   //CYBER
        //   this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCyberLiabilityPremium(this.quoteCGLOptions.limitOfLiabilityProduct)
        // }
      }
    })


    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.quotePLOptions = temp
        this.quotePLOptions.retroactiveDate = new Date(this.quotePLOptions.retroactiveDate)
        let liabiltyCovers = this.quotePLOptions.liabiltyCovers
        this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        this.deductibilitiesCount = 0
        this.deductibilitiesCount = this.quotePLOptions.liabiltyDeductibles.length;

        //RevenueDetails turnOverDetails
        if(!this.quotePLOptions.turnOverDetails)
        {
          this.quotePLOptions.turnOverDetails=new TurnOverDetails();
          this.quotePLOptions.turnOverDetails.revenueColumn=this.cols;
          this.rows.forEach(element => {
            var data=new TurnOverRows();
            data.label=element.label;
            data.name=element.value;
            data.firstYear= 0;
            data.secondYear= 0;
            data.thirdYear= 0;
            data.estimatedForNextYear= 0;
            this.quotePLOptions.turnOverDetails.revenueRows.push(data);
          });
        }
        else
        {

        }

        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT) {
          this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateProductLiabilityPremium(this.quotePLOptions.limitOfLiability)
        }
        else {
          //CYBER
          this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCyberLiabilityPremium(this.quotePLOptions.limitOfLiability)
        }
      }
    })
  }


  changeView($event) {
    this.quotePLOptions.isBreakupRevenueORTurnover = $event
  }

getTotalfirstYear()
{
  const firstYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
    return accumulator + object.firstYear;
  }, 0);
  return firstYear;
}

getTotalsecondYear()
{
  const secondYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
    return accumulator + object.secondYear;
  }, 0);
  return secondYear;
}

getTotalthirdYear()
{
  const thirdYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
    return accumulator + object.thirdYear;
  }, 0);
  return thirdYear;
}
getTotalestimatedForNextYear()
{
  const estimatedForNextYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
    return accumulator + object.estimatedForNextYear;
;
  }, 0);
  return estimatedForNextYear;
}

  updateYears() {
    const currentYear = new Date().getFullYear();
    this.cols[3].label = currentYear.toString();
    this.cols[2].label = (currentYear - 1).toString();
    this.cols[1].label = (currentYear - 2).toString();
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

    let updatePayloadQuote = this.quote;
    this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
      next: quote => {
        this.liabilityProductTemplateService.updateArray(this.quotePLOptions._id, this.quotePLOptions).subscribe({
          next: quote => {
            console.log("Product Liability Added Successfully");
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
    const ref = this.dialogService.open(LiabilityProductliabilityAddoncoversDialogComponent, {
      header: "Add-on Covers",
      width: '70%',
      styleClass: 'customPopup',
      closable:false,
      closeOnEscape:false,
      data: {
        quote: this.quote,
        covers: this.quotePLOptions.liabiltyCovers,
        quotePLOptions: this.quotePLOptions
      }
    }).onClose.subscribe((selectedCovers) => {
      //this.loadquoteDetails()
      this.selectedCoversCount = selectedCovers
    })


  }
}
