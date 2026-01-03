import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionType } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { IGMCTemplate, AllowedGMCPARENTabsTypes, GMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { EmployeeDemographic, IEmployeesDemoSummary, IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { RiskManagementFeaturesService } from 'src/app/features/admin/risk-management-features/risk-management-features.service';

@Component({
  selector: 'app-gmc-employee-details',
  templateUrl: './gmc-employee-details.component.html',
  styleUrls: ['./gmc-employee-details.component.scss']
})
export class GmcEmployeeDetailsComponent implements OnInit {
  expanded = false;
  private currentQuote: Subscription;
  private currentQuoteLocationOccupancyId: Subscription;
  private currentSelectedTemplate: Subscription;
  selectedQuoteTemplate: IQuoteGmcTemplate[];
  gmcTemplateData: IGMCTemplate[]
  tabsData: IGMCTemplate[] = []
  employeeDemographic: EmployeeDemographic = new EmployeeDemographic();

  @Input() permissions: PermissionType[] = []

  quote: IQuoteSlip;
  selectedQuoteLocationOccpancyId: string;
  newRiskManagementFeature: any;
  selectedRiskManagementFeatures: any[] = [];
  riskManagementFeatures: any[] = [];
  saveDialogeFlag: boolean = false;
  employeeInfo:IEmployeesDemoSummary[]=[];

  products: any[]
  constructor(
    private riskManagementFeaturesService: RiskManagementFeaturesService,   private appService: AppService,

    private quoteService: QuoteService,
  ) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote;
      }
    });

    this.currentSelectedTemplate = this.quoteService.currentQuoteOptions$.subscribe({
      next: (template) => {
        this.selectedQuoteTemplate = template;
        for (let element of this.selectedQuoteTemplate) {
          const dd = element.employeeDemographic
          this.employeeDemographic = dd;
          break;
        }
      }
    })
    this.getEmployeesDemographySummary();

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // this.currentQuoteLocationOccupancyId.unsubscribe();
    this.currentQuote.unsubscribe();
  }
  getAnswer(coveritemQuetions) {
    //console.log(coveritemQuetions)
    if (coveritemQuetions.inputControl == 'dropdown') {

      let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
      if (ans != undefined) {
        return ans.answer ==''?'--':ans.answer
      }
      else {
        return 'Not Selected'
      }


    }   else if (coveritemQuetions.inputControl == 'multiselectdropdown') {
      if (coveritemQuetions.selectedAnswer != 0) {

        if (Array.isArray(coveritemQuetions.selectedAnswer)) {
          const answersString = coveritemQuetions.selectedAnswer
            .map((item) => item.answer) // Extract `answer` property
            .filter((answer) => answer) // Remove undefined or empty values
            .join(", "); // Join with commas
          console.log("selectedAnswer is an array");
          return answersString;
        } else {
          console.log("selectedAnswer is not an array");
          return "-"
        }


      }
      else {
        return "-"
      }



    }
    else {
      return coveritemQuetions.selectedAnswer ==''?'--':coveritemQuetions.selectedAnswer
    }
  }
  getEmployeesDemographySummary() {
    let payload = {};
    payload['quoteId'] = this.quote._id;
    payload['fileType'] =  this.selectedQuoteTemplate[0].fileUploadType;
    this.quoteService.viewEmployeesSummary(payload).subscribe({
      next: summary => {
        this.employeeInfo = summary.data.entities;
      }
    })
  }

  downloadEmployeeDemographyExcel() {

    this.quoteService.downloadQuoteEmployeeDemographyExcel(this.quote?._id, this.selectedQuoteTemplate[0].fileUploadType).subscribe({
        next: (response: any) => this.appService.downloadSampleExcel(response),
        error: e => {
            console.log(e)
        }
    })
}
}
