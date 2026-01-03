import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import {  IQuoteSlip, SubsidiaryProductDetails, liabiltyProductAddOnCovers,TurnOverDetails, TurnOverRows } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';

@Component({
  selector: 'app-liability-pl-turnover-details',
  templateUrl: './liability-pl-turnover-details.component.html',
  styleUrls: ['./liability-pl-turnover-details.component.scss']
})
export class LiabilityProductliabilityTurnoverDetailsComponent implements OnInit {

  private currentQuote: Subscription;
  quote: IQuoteSlip;
  quotePLOptions: any
  showEditOption: boolean = false;
  private currentSelectedTemplate: Subscription;

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
  constructor(private accountService: AccountService, private quoteService: QuoteService, private liabilityProductTemplateService: liabilityProductTemplateService) {
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
        this.quotePLOptions = this.quote?.liabilityProductTemplateDataId;
        if (!this.quotePLOptions.turnOverDetails) {
          this.quotePLOptions.turnOverDetails = new TurnOverDetails();
          this.quotePLOptions.turnOverDetails.revenueColumn = this.cols;
          this.rows.forEach(element => {
            var data = new TurnOverRows();
            data.label = element.label;
            data.name = element.value;
            data.firstYear = 0;
            data.secondYear = 0;
            data.thirdYear = 0;
            data.estimatedForNextYear = 0;
            this.quotePLOptions.turnOverDetails.revenueRows.push(data);
          });
        }
        else {

        }
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quotePLOptions = template
        if (!this.quotePLOptions.turnOverDetails) {
          this.quotePLOptions.turnOverDetails = new TurnOverDetails();
          this.quotePLOptions.turnOverDetails.revenueColumn = this.cols;
          this.rows.forEach(element => {
            var data = new TurnOverRows();
            data.label = element.label;
            data.name = element.value;
            data.firstYear = 0;
            data.secondYear = 0;
            data.thirdYear = 0;
            data.estimatedForNextYear = 0;
            this.quotePLOptions.turnOverDetails.revenueRows.push(data);
          });
        }
        else {

        }
       
      }
    })
  }


  updateYears() {
    const currentYear = new Date().getFullYear();
    this.cols[3].label = currentYear.toString();
    this.cols[2].label = (currentYear - 1).toString();
    this.cols[1].label = (currentYear - 2).toString();
  }


  getTotalfirstYear() {
    const firstYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.firstYear;
    }, 0);
    return firstYear;
  }

  getTotalsecondYear() {
    const secondYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.secondYear;
    }, 0);
    return secondYear;
  }

  getTotalthirdYear() {
    const thirdYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.thirdYear;
    }, 0);
    return thirdYear;
  }
  getTotalestimatedForNextYear() {
    const estimatedForNextYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.estimatedForNextYear;
      ;
    }, 0);
    return estimatedForNextYear;
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
    this.liabilityProductTemplateService.updateArray(this.quotePLOptions._id, this.quotePLOptions).subscribe({
      next: quote => {
        console.log("PL Added Successfully");
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
