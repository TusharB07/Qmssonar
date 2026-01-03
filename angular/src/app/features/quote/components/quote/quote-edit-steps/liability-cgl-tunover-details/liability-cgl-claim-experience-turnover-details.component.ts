import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { IQuoteSlip, RevenueDetails, RevenueRows, TurnOverDetails, TurnOverRows } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { AllowedBreakup } from 'src/app/features/quote/pages/quote-view-page/quote-view-page.component';

@Component({
  selector: 'app-liability-cgl-claim-experience-turnover-details',
  templateUrl: './liability-cgl-claim-experience-turnover-details.component.html',
  styleUrls: ['./liability-cgl-claim-experience-turnover-details.component.scss']
})
export class LiabilityTurnoverDetailsComponent implements OnInit {

  private currentQuote: Subscription;
  quote: IQuoteSlip;
  quoteCGLOptions: any
  showEditOption: boolean = false;
  private currentSelectedTemplate: Subscription;

  

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
    {value: 'ROW', label : 'ROW (Rest of World)'},
    { value: 'total', label: 'Total' },
  ];
  constructor(private accountService: AccountService, private quoteService: QuoteService, private liabilityCGLTemplateService: liabilityCGLTemplateService) {
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
        this.quoteCGLOptions = this.quote?.liabilityCGLTemplateDataId;
        if (!this.quoteCGLOptions.turnOverDetails) {
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

        }
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteCGLOptions = template
        if (!this.quoteCGLOptions.turnOverDetails) {
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

        }
      }
    })
  }


  updateYears() {
    const currentYear = new Date().getFullYear();
    this.cols[5].label = currentYear.toString();
    this.cols[4].label = (currentYear - 1).toString();
    this.cols[3].label = (currentYear - 2).toString();
    this.cols[2].label = (currentYear - 3).toString();
    this.cols[1].label = (currentYear - 4).toString();

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

  getTotalfourthYear()
  {
    const fourthYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.fourthYear;
    }, 0);
    return fourthYear;
  }
  
  getTotalfifthYear()
  {
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
    this.liabilityCGLTemplateService.updateArray(this.quoteCGLOptions._id, this.quoteCGLOptions).subscribe({
      next: quote => {
        console.log("CGL Added Successfully");
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
