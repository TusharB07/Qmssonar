import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionType } from 'src/app/app.model';
import { ICoverageType } from 'src/app/features/admin/coverageTypes/coveragetypes.model';
import { CoverageTypesService } from 'src/app/features/admin/coverageTypes/coveragetypes.service';
import { IGMCTemplate, AllowedGMCPARENTabsTypes } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { IQuoteGmcTemplate, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { RiskManagementFeaturesService } from 'src/app/features/admin/risk-management-features/risk-management-features.service';
import { QcrAnswers, QcrHeaders, QCRQuestionAnswer } from 'src/app/features/quote/pages/quote-comparision-review-detailed-page-gmc/quote-comparasion-review-detailed-page.model';
import { GmcDescriptionDialogComponent } from '../../../gmc-description-dialog/gmc-description-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CoInsuranceFormDialogComponent } from '../../../other-details-crud-card/co-insurance-form-dialog/co-insurance-form-dialog.component';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-gmc-other-details',
  templateUrl: './gmc-other-details.component.html',
  styleUrls: ['./gmc-other-details.component.scss']
})
export class GmcOtherDetailsComponent implements OnInit {

  xpanded = false;
  private currentQuote: Subscription;
  private currentQuoteLocationOccupancyId: Subscription;
  private currentSelectedTemplate: Subscription;
  selectedQuoteTemplate: IQuoteGmcTemplate[];
  gmcTemplateData: IGMCTemplate[]
  tabsData: IGMCTemplate[] = []
  coverageTypeLst: ICoverageType[];

  @Input() permissions: PermissionType[] = []

  qcrHeaderTwoLst: QcrHeaders[] = []
  qmodel: QCRQuestionAnswer = new QCRQuestionAnswer()
  questionAnswerList: QCRQuestionAnswer[] = []
  qcrHeadersLst: QcrHeaders[] = []

  quote: IQuoteSlip;
  selectedQuoteLocationOccpancyId: string;
  newRiskManagementFeature: any;
  selectedRiskManagementFeatures: any[] = [];
  riskManagementFeatures: any[] = [];
  saveDialogeFlag: boolean = false;

  products: any[]
  otherDetailsForm: any;
  formBuilder: any;
  @Input() quoteOptionData: IQuoteOption   
  isCoInsurerChecked: boolean;


  constructor(
    private riskManagementFeaturesService: RiskManagementFeaturesService,
    private coverageTypesService: CoverageTypesService,
    private quoteService: QuoteService,  private dialogService: DialogService
  ) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote;
      }
    });

    

    this.currentSelectedTemplate = this.quoteService.currentQuoteOptions$.subscribe({
      next: (template) => {
        this.selectedQuoteTemplate=[]
        this.questionAnswerList=[];
        this.qcrHeadersLst=[]
        this.selectedQuoteTemplate = template.sort((n1,n2) => n1.optionIndex - n2.optionIndex);;
        let index = 1;
        let qcrHeaders = new QcrHeaders();
        qcrHeaders.label =""
        qcrHeaders.colspan = 0;
        this.qcrHeadersLst.push(qcrHeaders);

        this.selectedQuoteTemplate.forEach(element => {
          let qcrHeaders = new QcrHeaders();
          qcrHeaders.label = element.optionName
          qcrHeaders.colspan = 0;
          this.qcrHeadersLst.push(qcrHeaders);
          //Optiom Index
          const optionIndex = element.optionIndex;

          element.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.OTHERDETAILS).forEach(tempdata => {
            //Temp ID
            const tempId = tempdata._id
            if (optionIndex == 1) {
            this.qmodel = new QCRQuestionAnswer();
            this.qmodel.quoteId = element.quoteId;
            this.qmodel.question = tempdata.parentTabName;
            this.qmodel.isHeader = true;
            this.qmodel.isSubHeader = false;
            this.qmodel.isLabel = false;
            this.qmodel.colspan = 0;
            this.questionAnswerList.push(this.qmodel);
            }
            tempdata.gmcSubTab.forEach(gmcsTab => {

              //Sub Tab Id        
              const subtabId = gmcsTab._id
              //Subtab Name                  
              if (optionIndex == 1) {
                this.qmodel = new QCRQuestionAnswer();
                this.qmodel.quoteId = element.quoteId;
                this.qmodel.question = gmcsTab.subTabName;
                this.qmodel.isHeader = false;
                this.qmodel.isSubHeader = true;
                this.qmodel.isLabel = false;
                this.qmodel.colspan = 1;
                this.questionAnswerList.push(this.qmodel);
              }

              gmcsTab.gmcLabelForSubTab.forEach(pos => {

                //GMC LabelSubTabId
                const gmcLabelForSubTabId = pos._id;

                pos.gmcQuestionAnswers.forEach(eQues => {

                  //QuestionId
                  const questId = eQues._id;

                  this.qmodel = new QCRQuestionAnswer();
                  this.qmodel.quoteId = element.quoteId;
                  this.qmodel.tempId = tempId;
                  this.qmodel.subtabId = subtabId;
                  this.qmodel.gmcLabelForSubTabId = gmcLabelForSubTabId;
                  this.qmodel.questId = questId;
                  this.qmodel.isHeader = false;
                  this.qmodel.isSubHeader = false;
                  this.qmodel.isLabel = true;
                  //Answer Broker Ans
                  const qcrAnswers = new QcrAnswers();
                  qcrAnswers.answer = this.getAnswer(eQues);
                  qcrAnswers.icType = "Broker" + optionIndex;
                  qcrAnswers.id = questId;
                  qcrAnswers.optionIndex = optionIndex
                  qcrAnswers.freeTextValue = eQues.freeTextValue
                  if (optionIndex == 1) {

                    //Answer Broker Question
                    this.qmodel.question = eQues.question;
                    this.qmodel.freeTextValue=eQues.freeTextValue
                    this.qmodel.answer.push(qcrAnswers);
                  }
                  else {
                    //Search in answer array and add answer
                    this.questionAnswerList.filter(x => x.isHeader == false && x.question.trim() == eQues.question.trim() && x.subtabId == subtabId && x.gmcLabelForSubTabId == gmcLabelForSubTabId && x.questId == questId)[0].answer.push(qcrAnswers)
                  }

                  if (optionIndex == 1) {
                    this.questionAnswerList.push(this.qmodel);
                  }
                });
              });
            });
          });
        });
        // this.selectedQuoteTemplate.forEach(element => {
        //   const dd = element.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.MATERNITY)[0]
        //   this.tabsData.push(dd)
        // });
      }
    })


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
  openMoreInfoDialog(description) {
    const ref = this.dialogService.open(GmcDescriptionDialogComponent, {
      header: "More Information",
      data: {
        quote_id: this.quote?._id,
        description: description,
      },
      width: "30vw",
      styleClass: "customPopup customPopupDescription"
    }).onClose.subscribe(() => {

    })
  }

  openCoinsuranceDialog() {
    const ref = this.dialogService.open(CoInsuranceFormDialogComponent, {
        header: "Co-Insurance Details",
        styleClass: 'customPopup',
        width: '1000px',
        data: {
            quote: this.quote,
            quoteOptionData: this.quoteOptionData
        }
    })

    ref.onClose.subscribe((data) => {
    });
}

toggleTag(isChecked: boolean) {
  this.isCoInsurerChecked = isChecked;
}

}
