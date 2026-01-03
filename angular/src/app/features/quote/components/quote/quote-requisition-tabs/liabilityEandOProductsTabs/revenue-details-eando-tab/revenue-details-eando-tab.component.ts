import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedQuoteStates, IQuoteSlip, RevenueDetails, RevenueRows } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { LiabilityEandOAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-eando-addoncovers-dialog/liability-eando-addoncovers-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { IndicativePremiumCalcService } from '../../workmen-coverages-tab/indicativepremiumcalc.service';
import { AllowedBreakup } from 'src/app/features/quote/pages/quote-view-page/quote-view-page.component';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-revenue-details-eando-tab',
  templateUrl: './revenue-details-eando-tab.component.html',
  styleUrls: ['./revenue-details-eando-tab.component.scss']
})
export class RevenueDetailsEandOTabComponent implements OnInit, OnChanges {
  quoteEndOOptions: any;
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  selectedCoversCount: number = 0
  currentUser$: Observable<IUser>;
  deductibilitiesCount: number = 0
  headers: RevenueDetails[] = []
  subsideries: any[] = []
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
  constructor(private dialogService: DialogService, private indicativePremiumCalcService: IndicativePremiumCalcService, private accountService: AccountService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityEandOTemplateService: liabilityEandOTemplateService,
  ) {
    this.currentUser$ = this.accountService.currentUser$
    this.updateYears()
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quoteEndOOptions = this.quote?.liabilityEandOTemplateDataId;
        this.quoteEndOOptions.retroactiveDate = new Date(this.quoteEndOOptions.retroactiveDate)
        let liabiltyCovers = this.quoteEndOOptions.liabiltyCovers
        this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        this.deductibilitiesCount = 0
        this.subsideries = this.quoteEndOOptions.subsidaryDetails
        this.headers = this.subsideries.map(e=>e.countryName)
        if (!this.quoteEndOOptions.liabiltyDeductibles) {
          this.quoteEndOOptions.liabiltyDeductibles = [];
        }
        this.deductibilitiesCount = this.quoteEndOOptions.liabiltyDeductibles.length;
        //RevenueDetails revenueDetails
        if (!this.quoteEndOOptions.revenueDetails) {
          this.quoteEndOOptions.revenueDetails = new RevenueDetails();
          this.quoteEndOOptions.revenueDetails.revenueColumn = this.cols;
          this.rows.forEach(element => {
            var data = new RevenueRows();
            data.label = element.label;
            data.name = element.value;
            data.firstYear = 0;
            data.secondYear = 0;
            data.thirdYear = 0;
            data.estimatedForNextYear = 0;
            this.quoteEndOOptions.revenueDetails.revenueRows.push(data);
          });
        }
        else {

        }

        this.quoteEndOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateEandOPremium(this.quoteEndOOptions.limitOfLiability)

      }
    })
  }

  changeView($event) {
    this.quoteEndOOptions.isBreakupRevenueORTurnover = $event
  }

  getTotalfirstYear() {
    const firstYear = this.quoteEndOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.firstYear;
    }, 0);
    return firstYear;
  }

  getTotalsecondYear() {
    const secondYear = this.quoteEndOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.secondYear;
    }, 0);
    return secondYear;
  }

  getTotalthirdYear() {
    const thirdYear = this.quoteEndOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.thirdYear;
    }, 0);
    return thirdYear;
  }
  getTotalestimatedForNextYear() {
    const estimatedForNextYear = this.quoteEndOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
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
        this.liabilityEandOTemplateService.updateArray(this.quoteEndOOptions._id, this.quoteEndOOptions).subscribe({
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
    const ref = this.dialogService.open(LiabilityEandOAddoncoversDialogComponent, {
      header: "Add-on Covers",
      width: '70%',
      styleClass: 'customPopup',
      closable: false,
      closeOnEscape: false,
      data: {
        quote: this.quote,
        covers: this.quoteEndOOptions.liabiltyCovers,
        quoteEandOOptions: this.quoteEndOOptions
      }
    }).onClose.subscribe((selectedCovers) => {
      //this.loadquoteDetails()
      this.selectedCoversCount = selectedCovers
    })


  }
}

