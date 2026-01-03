import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { AllowedQuoteStates, IQuoteSlip, RevenueDetails, RevenueRows } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';

@Component({
  selector: 'app-eando-liability-revenue-details',
  templateUrl: './eando-liability-revenue-details.component.html',
  styleUrls: ['./eando-liability-revenue-details.component.scss']
})
export class LiabilityEandORevenueDetailsComponent implements OnInit {
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  quoteEandOOptions: any
  showEditOption = false;
  private currentSelectedTemplate: Subscription;
  AllowedProductTemplate = AllowedProductTemplate;

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
    { value: 'ROW', label: 'ROW (Rest of World)' },
    { value: 'total', label: 'Total' },
  ];
  constructor(private accountService: AccountService, private quoteService: QuoteService, private liabilityEandOTemplateService: liabilityEandOTemplateService) {
    // * DO NOT TOUCH
    this.accountService.currentUser$.subscribe({
      next: user => {
        const role: IRole = user.roleId as IRole;
        if (AllowedRoles.INSURER_RM == role?.name) {
          this.showEditOption = false;
        }
        else {
          this.showEditOption = true;
        }
      }
    });
    this.updateYears()
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        if (this.quote?.liabilityEandOTemplateDataId != null && this.quote?.liabilityEandOTemplateDataId["_id"] != undefined) {
          this.quoteEandOOptions = this.quote?.liabilityEandOTemplateDataId;
          if (!this.quoteEandOOptions.revenueDetails) {
            this.quoteEandOOptions.revenueDetails = new RevenueDetails();
            this.quoteEandOOptions.revenueDetails.revenueColumn = this.cols;
            this.rows.forEach(element => {
              var data = new RevenueRows();
              data.label = element.label;
              data.name = element.value;
              data.firstYear = 0;
              data.secondYear = 0;
              data.thirdYear = 0;
              data.estimatedForNextYear = 0;
              this.quoteEandOOptions.revenueDetails.revenueRows.push(data);
            });
          }
          else {

          }
        }
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        if ([AllowedProductTemplate.LIABILITY_EANDO].includes(this.quote?.productId['productTemplate'])) {
          this.quoteEandOOptions = template
          if (!this.quoteEandOOptions.revenueDetails) {
            this.quoteEandOOptions.revenueDetails = new RevenueDetails();
            this.quoteEandOOptions.revenueDetails.revenueColumn = this.cols;
            this.rows.forEach(element => {
              var data = new RevenueRows();
              data.label = element.label;
              data.name = element.value;
              data.firstYear = 0;
              data.secondYear = 0;
              data.thirdYear = 0;
              data.estimatedForNextYear = 0;
              this.quoteEandOOptions.revenueDetails.revenueRows.push(data);
            });
          }
          else {

          }
        }

      }
    })
  }

  ngOnInit(): void {
  }


  getTotalfirstYear() {
    const firstYear = this.quoteEandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.firstYear;
    }, 0);
    return firstYear;
  }

  getTotalsecondYear() {
    const secondYear = this.quoteEandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.secondYear;
    }, 0);
    return secondYear;
  }

  getTotalthirdYear() {
    const thirdYear = this.quoteEandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.thirdYear;
    }, 0);
    return thirdYear;
  }
  getTotalestimatedForNextYear() {
    const estimatedForNextYear = this.quoteEandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
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


  save() {
    this.liabilityEandOTemplateService.updateArray(this.quoteEandOOptions._id, this.quoteEandOOptions).subscribe({
      next: quote => {
        console.log("E&O Added Successfully");
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

}
