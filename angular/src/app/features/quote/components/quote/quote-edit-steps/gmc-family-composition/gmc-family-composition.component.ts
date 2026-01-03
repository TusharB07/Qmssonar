import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionType } from 'src/app/app.model';
import { AllowedGMCPARENTabsTypes, IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { RiskManagementFeaturesService } from 'src/app/features/admin/risk-management-features/risk-management-features.service';
import { QuoteViewModel } from './rmview.model';
import { GmcGradedSiDialogComponent } from '../../../gmc-graded-si-dialog/gmc-graded-si-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { GmcDescriptionDialogComponent } from '../../../gmc-description-dialog/gmc-description-dialog.component';
import { ICoverageType } from 'src/app/features/admin/coverageTypes/coveragetypes.model';
import { CoverageTypesService } from 'src/app/features/admin/coverageTypes/coveragetypes.service';
import { QCRQuestionAnswer, QcrAnswers, QcrHeaders } from 'src/app/features/quote/pages/quote-comparision-review-detailed-page-gmc/quote-comparasion-review-detailed-page.model';
import { GmcGradedSiDialogRmunderwriterviewComponent } from '../../../gmc-graded-si-dialog-rmunderwriterview/gmc-graded-si-dialog-rmunderwriterview.component';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-gmc-family-composition',
  templateUrl: './gmc-family-composition.component.html',
  styleUrls: ['./gmc-family-composition.component.scss']
})
export class GmcFamilyCompositionComponent implements OnInit {
  expanded = false;
  private currentQuote: Subscription;
  private currentQuoteLocationOccupancyId: Subscription;
  private currentSelectedTemplate: Subscription;
  selectedQuoteTemplate: IQuoteGmcTemplate[];
  gmcTemplateData: IGMCTemplate[]
  tabsData: IGMCTemplate[] = []

  quoteViewModel: QuoteViewModel = new QuoteViewModel()
  quoteViewModelLst: QuoteViewModel[] = []
  qcrHeaderTwoLst: QcrHeaders[] = []
  qmodel: QCRQuestionAnswer = new QCRQuestionAnswer()
  questionAnswerList: QCRQuestionAnswer[] = []
  qcrHeadersLst: QcrHeaders[] = []
  @Input() permissions: PermissionType[] = []

  quote: IQuoteSlip;
  selectedQuoteLocationOccpancyId: string;
  newRiskManagementFeature: any;
  selectedRiskManagementFeatures: any[] = [];
  riskManagementFeatures: any[] = [];
  saveDialogeFlag: boolean = false;
  coverageTypeLst: ICoverageType[];
  products: any[]
  constructor(
    private riskManagementFeaturesService: RiskManagementFeaturesService,
    private dialogService: DialogService,
    private quoteService: QuoteService, private coverageTypesService: CoverageTypesService,
  ) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote;
        const qcrHeaderstwo = new QcrHeaders();
        qcrHeaderstwo.colspan = 0;
        qcrHeaderstwo.label = this.quote.partnerId['name']
      }
    });

    this.currentSelectedTemplate = this.quoteService.currentQuoteOptions$.subscribe({
      next: (template) => {
        if (template != null) {
          this.selectedQuoteTemplate=[]
          this.questionAnswerList=[];
          this.qcrHeadersLst=[]
          this.selectedQuoteTemplate = template.sort((n1, n2) => n1.optionIndex - n2.optionIndex);
          let index = 1;
          let qcrHeaders = new QcrHeaders();
          qcrHeaders.label = ""
          qcrHeaders.colspan = 0;
          this.qcrHeadersLst.push(qcrHeaders);
          let subHeaderAdded = false;
          this.selectedQuoteTemplate.forEach(element => {
            let qcrHeaders = new QcrHeaders();
            qcrHeaders.label = element.optionName
            qcrHeaders.colspan = 0;
            this.qcrHeadersLst.push(qcrHeaders);
            //Optiom Index
            const optionIndex = element.optionIndex;

            element.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION).forEach(tempdata => {
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
                this.qmodel.optionIndex = optionIndex;
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
                  this.qmodel.optionIndex = optionIndex;
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
                    this.qmodel.optionIndex = optionIndex;
                    //Answer Broker Ans
                    const qcrAnswers = new QcrAnswers();
                    if (eQues.question == "Family Definition") {
                      qcrAnswers.answer = [element.coverageTypeName];
                    }
                    else {
                      qcrAnswers.answer = this.getAnswer(eQues, element.siFlat);
                    }
                    qcrAnswers.icType = "Broker" + optionIndex;
                    qcrAnswers.id = questId;
                    qcrAnswers.optionIndex = optionIndex
                    qcrAnswers.freeTextValue = eQues.freeTextValue
                    if (optionIndex == 1) {

                      //Answer Broker Question
                      this.qmodel.question = eQues.question;
                      this.qmodel.optionIndex = optionIndex;
                      this.qmodel.answer.push(qcrAnswers);


                    }
                    else {
                      //this.qmodel.freeTextValue = eQues.freeTextValue
                      //Search in answer array and add answer
                      //this.questionAnswerList.filter(x => x.isHeader == false && x.question.trim() == eQues.question.trim() && x.subtabId == subtabId && x.gmcLabelForSubTabId == gmcLabelForSubTabId && x.questId == questId)[0].freeTextValue = eQues.freeTextValue

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
        }

      }
    })


  }

  ngOnInit(): void {
    this.getCoverageTypes();
  }

  ngOnDestroy(): void {
    // this.currentQuoteLocationOccupancyId.unsubscribe();
    this.currentQuote.unsubscribe();
  }
  isFlatGraded(coveritemQuetions) {

  }
  getAnswer(coveritemQuetions, siFlat) {
    //console.log(coveritemQuetions)
    if (coveritemQuetions.inputControl == 'dropdown') {

      let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
      if (ans != undefined) {
        if (ans.answer.trim() == 'Flat') {
          return ans.answer.trim() + " (" + siFlat + ")"
        }
        return ans.answer.trim()
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

  getCoverageTypeText(option, coverageTypeLst) {
    if (option.coverageTypeId != "") {
      return coverageTypeLst.filter(x => x._id == option.coverageTypeId)[0].coverageType
    }
    return ''
  }

  getCoverageTypes() {
    this.coverageTypesService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        console.log(records);
        this.coverageTypeLst = records.data.entities;

      },
      error: e => {
        console.log(e);
      }
    });
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

  openDialog(ans) {
    const ref = this.dialogService.open(GmcGradedSiDialogRmunderwriterviewComponent, {
      header: "Graded SI",
      data: {
        quote_id: this.quote?._id,
        quote: this.quote,
        optionIndex:ans.optionIndex
      },
      width: "50vw",
      styleClass: "customPopup"
    }).onClose.subscribe(() => {

    })
  }
}
