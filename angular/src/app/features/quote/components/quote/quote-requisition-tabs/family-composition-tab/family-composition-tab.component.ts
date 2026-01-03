import { Component, EventEmitter, OnInit, Output, forwardRef } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AllowedGMCPARENTabsTypes, GMCQuestionAnswers, GMCTemplate, IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { GmcMasterService } from 'src/app/features/admin/gmc-master/gmc-master.service';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { IEmployeeData, IEmployeesDemoSummary, IGmcDataModel, IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { GmcGradedSiDialogComponent } from '../../../gmc-graded-si-dialog/gmc-graded-si-dialog.component';
import { CoverageTypesService } from 'src/app/features/admin/coverageTypes/coveragetypes.service';
import { ICoverageType } from 'src/app/features/admin/coverageTypes/coveragetypes.model';
import { GmEmloyeesService } from 'src/app/features/broker/quote-gmc-employeeview-dialog/gmc-employess-service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { DDLModel } from '../employee-demographic-tab/employee-demographic-tab-model';
import { SumInsuredService } from 'src/app/features/admin/sumInsured/suminsured.service';
import { EmpRatesService } from 'src/app/features/admin/emp-ratesTemplates/emprates.service';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 100,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-family-composition-tab',
  templateUrl: './family-composition-tab.component.html',
  styleUrls: ['./family-composition-tab.component.scss']
})
export class FamilyCompositionTabComponent implements OnInit {

  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  calculatedPremium: number = 0
  quoteTemplate: IQuoteGmcTemplate
  tabsData: IGMCTemplate = new GMCTemplate();
  quote: IQuoteSlip;
  ddlText: string
  selectedCoveragesType: any
  coverageTypeLst: ICoverageType[];
  employeeInfo: IEmployeesDemoSummary[] = [];
  ratesInfo: any;
  empDatawithGrades: IEmployeeData[] = []
  productCarouselArray: ICoverageType[];
  selectedCoverageType: any
  private currentQuote: Subscription;
  private currentSelectedTemplate: Subscription;
  selectedQuoteTemplate: IQuoteGmcTemplate;
  optionsSumInsured: ILov[] = [];
  optionsSumInsuredmaster: ILov[] = [];
  selectedQuoteTemplatesiFlat: any;
  policies = [
    { label: 'Same as Base Policy', value: 'basepolicy' },
    { label: 'Others', value: 'others' }
  ];
  constructor(private empRateService: EmpRatesService,
    private messageService: MessageService, private sumInsuredService: SumInsuredService, private qoutegmctemplateserviceService: QoutegmctemplateserviceService,
    private employeeService: GmEmloyeesService, private coverageTypesService: CoverageTypesService, private quoteService: QuoteService, private dialogService: DialogService, private gmcQuoteTemplateService: QoutegmctemplateserviceService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.getCoverageTypes();
        this.getSumInsureds();
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.selectedQuoteTemplate = template;
        this.getCoveragesTypes();

        this.tabsData = template.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION)[0]
        if (this.tabsData != undefined) {
        }

        this.tabsData.gmcSubTab.forEach(element => {
          element.gmcLabelForSubTab.forEach(elementSubTab => {
            elementSubTab.gmcQuestionAnswers.forEach(elementQues => {
              if (elementQues?.question?.toLowerCase().trim() == 'sum insured basis') {
                const selectedAnswer = elementQues?.answer.find((x: any) => x._id === elementQues?.selectedAnswer);
                this.ddlText = selectedAnswer ? selectedAnswer.answer.trim() : "";

              }
              if (elementQues?.question?.toLowerCase().trim() == 'family demography' || elementQues?.question?.toLowerCase().trim() == 'insured') {
                elementQues.freeText = false
                elementQues.freeTextValue = this.quote?.employeeDataId['coverageInfo']
              }

              if (elementQues?.question?.toLowerCase().trim() == 'sum insured amount') {
                elementQues.selectedAnswer = this.selectedQuoteTemplate.siFlat
              }
            });
          });
        });
      }
    })
  }

  ngOnInit(): void {
    this.getCoverageTypes();
  }



  getSumInsureds() {
    this.sumInsuredService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: data => {
        this.optionsSumInsured = data.data.entities.sort((n1, n2) => +n1.sumInsured - +n2.sumInsured).map(entity => ({ label: '₹ ' + Intl.NumberFormat('en-IN').format(+entity.sumInsured).toString(), value: entity._id }));
        if (this.selectedQuoteTemplate != undefined) {
          if (this.selectedQuoteTemplate.siType.trim() == 'Flat') {
            this.selectedQuoteTemplatesiFlat = this.optionsSumInsured.filter(x => x.label == '₹ ' + Intl.NumberFormat('en-IN').format(+this.selectedQuoteTemplate.siFlat).toString())[0]
            console.log(this.selectedQuoteTemplatesiFlat);
          }
        }
      },
      error: e => { }
    });
  }

  onCheckboxChange(event: any, gmcQuestionAnswers: any[]) {
    gmcQuestionAnswers.forEach(element => {
      if (element.inputControl === 'dropdown') {
        const selectedAnswer = event.checked
          ? element.answer.find(x => x.answer === 'Covered' || x.answer === 'Applicable')
          : element.answer.find(x => x.answer === 'Not covered' || x.answer === 'Not applicable');

        if (selectedAnswer) {
          element.selectedAnswer = selectedAnswer._id;
          this.onDDLChange(null, element, gmcQuestionAnswers);
        }
      }
      else if (element.inputControl === 'radiobutton') {
        if (event.checked) {
          element.selectedAnswer = element.answer.some(x => x.answer === 'Covered') ? "Covered"
            : element.answer.some(x => x.answer === 'Applicable') ? "Applicable"
              : null;
        } else {
          element.selectedAnswer = element.answer.some(x => x.answer === 'Covered') ? "Not covered"
            : element.answer.some(x => x.answer === 'Applicable') ? "Not applicable"
              : null;
        }
      }
      else if (element.inputControl === 'multiselectdropdown') {
        if (event.checked) {
          element.selectedAnswer = element.answer
            .filter(x => x.answer === 'Covered' || x.answer === 'Applicable')
            .map(x => x._id);
        } else {
          element.selectedAnswer = element.answer
            .filter(x => x.answer === 'Not covered' || x.answer === 'Not applicable')
            .map(x => x._id);
        }
      }
    });
  }
  getCoveragesTypes() {
    this.coverageTypesService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        console.log(records);
        if (this.quote.productId["type"].toLowerCase() === "group health policy" || this.quote.productId["type"].toLowerCase() === "group health policy top up") {
          this.productCarouselArray = records.data.entities;
        }
        else {
          this.productCarouselArray = records.data.entities.filter(x => x.abbreviation == "E" || x.abbreviation == "ES");
        }

        if (this.productCarouselArray.length > 0) {
          console.log(this.quote?.employeeDataId['coverageTypeId'])
          if (this.quote?.employeeDataId['coverageTypeId'] != null && this.quote?.employeeDataId['coverageType'] != null) {
            this.selectedCoverageType = this.productCarouselArray.find(x => x._id == this.selectedQuoteTemplate.coverageTypeId);
          }
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }

  onSISelect(event) {
    //this.selectedQuoteTemplatesiFlat=event.label;
    console.log(event)
    console.log(this.selectedQuoteTemplatesiFlat)
    if (this.selectedQuoteTemplate.planType == "Floater") {
      let siamount = event.value.label.replace(/\D/g, '');
      this.selectedQuoteTemplate.siFlat = +siamount;
    }
    else {
      this.selectedQuoteTemplate.siFlat = 0;
      this.selectedQuoteTemplatesiFlat = null;
    }

  }


  updateEmpCoveraegs(value: ICoverageType) {

    this.selectedCoverageType = value;
    //this.checkCoverageType(this.selectedCoverageType.abbreviation, this.employeeInfo);
    const emp_id = this.quote?.employeeDataId['_id'];
    const coverageType = this.productCarouselArray.find(p => p._id == this.selectedCoverageType._id).abbreviation;
    const updatePayload = {
      _id: this.quote?.employeeDataId['_id'],
      employeeData: this.quote?.employeeDataId['employeeData'],
      quoteId: this.quote?.employeeDataId['quoteId'],
      filePath: this.quote?.employeeDataId['filePath'],
      coverageType: coverageType,
      coverageTypeId: this.selectedCoverageType._id
    }

    //updatePayload['coverageType']=coverageType;
    this.employeeService.update(emp_id, updatePayload)
      .subscribe({
        next: res => {
          this.quoteService.get(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
              this.quote = dto.data.entity;
              this.selectedQuoteTemplate.coverageTypeName = coverageType
              this.selectedQuoteTemplate.coverageTypeId = this.selectedCoverageType._id
              this.saveTabs(false)
            },
            error: e => {
              console.log(e);
            }
          });
        },
        error: e => {
          console.log(e.error);
          this.messageService.add({
            severity: "fail",
            summary: "Fail",
            detail: e.error.message,
            life: 3000
          });
        }
      });
  }

  getCoverageTypes() {
    this.coverageTypesService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        console.log(records);
        if (this.quote.ebPlan == "Non Employer Employee") {
          this.coverageTypeLst = records.data.entities.filter(x => x.isEmployer == false);
        }
        else {
          this.coverageTypeLst = records.data.entities.filter(x => x.isEmployer == true);
        }

        if (this.selectedQuoteTemplate != undefined) {
          if (this.selectedQuoteTemplate.coverageTypeId == "") {
            this.selectedQuoteTemplate.coverageTypeId = this.coverageTypeLst.filter(x => x._id == this.quote?.employeeDataId['coverageTypeId'])[0]._id
            this.selectedQuoteTemplate.coverageTypeName = this.coverageTypeLst.filter(x => x._id == this.quote?.employeeDataId['coverageTypeId'])[0].abbreviation;
            //this.saveTabs(false);
          }
        }


      },
      error: e => {
        console.log(e);
      }
    });
  }

  onDDLChangeFamilyDefinition(itemquestion: any, item: any) {
    //this.selectedQuoteTemplate.coverageTypeName = this.coverageTypeLst.filter(x => x.coverageType == this.selectedQuoteTemplate.coverageTypeName)[0].abbreviation;
    if (item.subTabName == 'Family Definition') {
      item.gmcLabelForSubTab.forEach(elementLbl => {
        elementLbl.gmcQuestionAnswers.forEach(elementQ => {
          if (elementQ.question != 'Family Definition') {
            elementQ.isSelected = false;
            elementQ.selectedAnswer = "";
          }
        });

      });
    }
    //this.saveTabs(false)

  }

  // Function to extract max ages and create the family abbreviation
  deriveFamilyDetails(input: string) {
    // Define abbreviations for family members
    const Abbreviation = {
      Employee: 'E',
      Spouse: 'S',
      Children: 'C',
      Parents: 'P'
    };
    const hasParents = input.includes("Father") || input.includes("Mother");
    const maxAgeForChildren = 25; // Derived from the input for Daughter and Son
    const maxAgeForParents = hasParents ? 80 : null; // Derived from the input for Father and Mother

    const abbreviation = hasParents
      ? `${Abbreviation.Employee}${Abbreviation.Spouse}${Abbreviation.Children}${Abbreviation.Parents}`
      : `${Abbreviation.Employee}${Abbreviation.Spouse}${Abbreviation.Children}`;

    return {
      abbreviation,
      maxAgeForChildren,
      maxAgeForParents
    };
  }

  updateQuestionStates(questions: any[], changedQuestion: any) {
    const selectedAnswer = changedQuestion.answer.find((a: any) => a._id === changedQuestion.selectedAnswer);

    // If the selected answer is "Not Covered", recursively deactivate child questions
    if (selectedAnswer && selectedAnswer.answer === "Not Covered") {
      questions.forEach((question: any) => {
        if (+question.parentQuestionId === changedQuestion._id) {
          question.isActive = false; // Hide the child question
          question.selectedAnswer = 0; // Reset the child's selected answer
          this.updateQuestionStates(questions, question); // Recursively deactivate deeper children
        }
      });
    } else {
      // If an active answer is selected, ensure dependent questions are visible
      questions.forEach((question: any) => {
        if (+question.parentQuestionId === changedQuestion._id) {
          question.isActive = true; // Activate the child question
          this.updateQuestionStates(questions, question); // Recursively handle deeper children
        }
      });
    }
  }

  updateQuestionVisibility(questions: any[], itemquestion: any) {
    // Helper function to check parent activity recursively
    const isParentActive = (questionId: number): boolean => {
      if (!questionId) return true; // No parent means active
      const parentQuestion = questions.find((q) => q._id === questionId);
      if (!parentQuestion || !parentQuestion.isActive) return false; // Parent is inactive
      return isParentActive(+parentQuestion.parentQuestionId); // Recursively check parent's activity
    };

    // Iterate over all questions to update visibility
    questions.forEach((question) => {
      if (+question.parentQuestionId === itemquestion._id) {
        // Check if parent's selected answer is positive
        const isParentPositive = itemquestion.answer.some(
          (answer) => answer._id === itemquestion.selectedAnswer && answer.isPositive
        );

        // Update the active state of the child question
        question.isActive = isParentPositive && isParentActive(+itemquestion._id);
        if (!question.isActive) {
          question.selectedAnswer = 0; // Reset the answer of inactive questions
        }

        // Recursively update visibility of deeper children
        this.updateQuestionVisibility(questions, question);
      }
    });
  }

  onMultiSelectChange(event: any, itemquestion: any) {
    console.log('Selected values:', event.value);
    console.log('Item Question:', itemquestion);

    // Your logic for handling selected values
    itemquestion.selectedAnswer = event.value; // Update selectedAnswer if needed
  }
  onDDLChange(event: any, itemquestion: any, gmcQuestionAnswers: any) {
    // Update selected answer
    const selectedAnswer = itemquestion.answer.find((x: any) => x._id === itemquestion.selectedAnswer);
    this.ddlText = selectedAnswer ? selectedAnswer.answer.trim() : "";

    // Update the isSelected flag for answers
    itemquestion.answer.forEach((element: any) => {
      element.isSelected = element._id === itemquestion.selectedAnswer;
    });

    // Update question visibility and states
    this.updateQuestionStates(gmcQuestionAnswers, itemquestion);

    // Optionally call a visibility handler if needed
    this.updateQuestionVisibility(gmcQuestionAnswers, itemquestion);


    if (itemquestion.question == "Sum Insured Basis") {
      if (this.selectedQuoteTemplate.fileUploadType == "Aggregate" && this.ddlText == "Graded") {
        this.messageService.add({
          severity: 'fail',
          summary: "Error",
          detail: `Employee datat is in Aggregate.Cannot calculate graded`, //"error" TODO: Check
        })
        itemquestion.selectedAnswer = 1;
        return;
      }
      if (["Floater", "Family floater"].includes(this.selectedQuoteTemplate.planType)) {
        if (this.ddlText == "Graded") {
          this.selectedQuoteTemplate.siType = "Graded";
          //this.saveTabs(false)
          console.log("Opening Dialog")
          console.log(this.selectedQuoteTemplate.calculatedPremium)
          const ref = this.dialogService.open(GmcGradedSiDialogComponent, {
            header: "Graded SI",
            data: {
              quote_id: this.quote?._id,
              quote: this.quote,
              selectedQuoteTemplate: this.selectedQuoteTemplate,

            },
            width: "50vw",
            styleClass: "customPopup"
          }).onClose.subscribe(() => {
            //this.getEmployeesDemographySummary()
            this.loadQuoteDetails(this.quote._id);
          })
        }
        else {
          this.selectedQuoteTemplate.siType = "Flat"
          //this.selectedQuoteTemplate.gmcGradedSILst=[]
        }
      }
      else {
        this.selectedQuoteTemplate.siType = "Flat"
        //this.selectedQuoteTemplate.gmcGradedSILst=[]
      }
    }
    if (itemquestion.question == 'Sum insured Type') {
      this.selectedQuoteTemplate.planType = this.ddlText
    }
    if (this.ddlText == "Base Policy") {
      this.CopyBaseQuoteDaTA()
    }
  }


  CopyBaseQuoteDaTA() {
    if (this.quote.baseQuoteNo != "") {
      console.log("here" + this.quote.baseQuoteNo);
      this.quoteService.getQuoteByQuoteNo(this.quote.baseQuoteNo).subscribe({
        next: (dto: IOneResponseDto<IQuoteSlip>) => {
          let baseQuoteId = dto.data.entity[0]._id
          this.quoteService.getAllQuoteOptions(baseQuoteId).subscribe({
            next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
              const baseOption = dto.data.entity.find((x) => x.optionIndex === 1);
              if (!baseOption) {
                console.error("Base Option not found.");
                return;
              }
              const baseFamilyComposition = baseOption.gmcTemplateData.find(
                (x) => x.parentTabName === AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION
              );

              if (!baseFamilyComposition) {
                console.error("Family Composition data not found in base option.");
                return;
              }
              // Replace only FAMILYCOMPOSITION in selectedQuoteTemplate
              const updatedGmcTemplateData = this.selectedQuoteTemplate.gmcTemplateData.map((item) => {
                if (item.parentTabName === AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION) {
                  return baseFamilyComposition; // Replace with baseFamilyComposition
                }
                return item; // Keep other items unchanged
              });

              // Update the selectedQuoteTemplate object
              this.selectedQuoteTemplate = {
                ...this.selectedQuoteTemplate,
                gmcTemplateData: updatedGmcTemplateData,
              };
              this.tabsData = this.selectedQuoteTemplate.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION)[0]

            },
            error: e => {
              console.log(e);
            }
          });
        },
        error: e => {
          console.log(e);
        }
      });

    }
  }

  loadQuoteDetails(qoute_id) {
    this.quoteService.get(qoute_id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quote = dto.data.entity;
        // console.log(this.quote)     
        this.getOptions();
      },
      error: e => {
        console.log(e);
        //this.DemographyFileuploaded();
      }
    });
  }

  getOptions() {
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.loadOptionsData(dto.data.entity);
        this.loadSelectedOption(dto.data.entity.filter(x => x.optionName == this.selectedQuoteTemplate.optionName)[0])
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadOptionsData(quoteOption: IQuoteGmcTemplate[]) {
    this.quoteService.setQuoteOptions(quoteOption)
  }

  loadSelectedOption(quoteOption: IQuoteGmcTemplate) {
    this.quoteService.setSelectedOptions(quoteOption)
  }

  openDialog() {
    const ref = this.dialogService.open(GmcGradedSiDialogComponent, {
      header: "Graded SI",
      data: {
        quote_id: this.quote?._id,
        quote: this.quote,
        selectedQuoteTemplate: this.selectedQuoteTemplate
      },
      width: "50vw",
      styleClass: "customPopup"
    }).onClose.subscribe(() => {
      this.loadQuoteDetails(this.quote._id);
      //this.saveTabs(null);
    })
  }
  getAnsFromAI() {
    this.gmcQuoteTemplateService.getAIAnswers(this.selectedQuoteTemplate._id, "FamilyComposition").subscribe({
      next: partner => {
        console.log(partner.data.entity.response)
        let jsonstr = null
        // Example usage
        let familyDetails = null;
        if (partner.data.entity.response != "") {

          jsonstr = this.cleanAndParseJsonString(partner.data.entity.response);
          familyDetails = this.deriveFamilyDetails(jsonstr.FamilyDefinitionString);
          console.log(familyDetails)
        }

        this.selectedQuoteTemplate.coverageTypeName = familyDetails.abbreviation
        let familydefinitionTabData = this.tabsData.gmcSubTab.filter(x => x.subTabName == "Family Definition")[0]
        if (familydefinitionTabData != undefined) {
          familydefinitionTabData.gmcLabelForSubTab.forEach(element => {
            if (element.labelName == "Children") {

              element.gmcQuestionAnswers.forEach(elementQues => {
                if (elementQues.question == "Age Limit for Children") {
                  let ansAI = elementQues.answer.filter(x => x.answer == familyDetails.maxAgeForChildren)[0]
                  elementQues.selectedAnswer = ansAI._id;
                }
                if (elementQues.question == "No of Children") {
                  let ansAI = elementQues.answer.filter(x => x.answer == jsonstr.numberOfDependentChildren)[0]
                  elementQues.selectedAnswer = ansAI._id;
                }
              });
            }

            if (element.labelName == "Parents") {
              element.gmcQuestionAnswers.forEach(elementQues => {
                if (elementQues.question == "Age Limit of Parent/Parents in law") {
                  let ansAI = elementQues.answer.filter(x => x.answer == familyDetails.maxAgeForParents)[0]
                  elementQues.selectedAnswer = ansAI._id;
                }
              });
            }
          });
        }

        //this.getEmployeesDemographySummary()
      },
      error: error => {
        console.log(error);
      }
    });
  }

  cleanAndParseJsonString(input: string): any {
    // Remove markdown syntax
    const cleanedString = input
      .replace(/^```json\n/, '')  // Remove starting markdown syntax
      .replace(/\n```$/, '')      // Remove ending markdown syntax
      .trim();                    // Remove any extra whitespace

    // Parse the cleaned JSON string
    return JSON.parse(cleanedString);
  }

  saveTabs(isFromButton: boolean) {
    const updatePayload = this.selectedQuoteTemplate

    this.gmcQuoteTemplateService.updateArray(updatePayload._id, updatePayload).subscribe({
      next: partner => {
        if (isFromButton) {
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Successful",
          //   detail: `Saved`,
          //   life: 3000
          // });
        }
        //this.getEmployeesDemographySummary()
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getEmployeesDemographySummary() {
    let payload = {};
    payload['quoteId'] = this.quote._id;
    payload['fileType'] = this.selectedQuoteTemplate.fileUploadType;
    this.quoteService.viewEmployeesSummary(payload).subscribe({
      next: summary => {
        if (summary.status == "success") {
          this.employeeInfo = summary.data.entities;
          //this.selectedQuoteTemplate.calculatedPremium = 0;
          this.calculatePremium();
        } else {
          this.messageService.add({
            severity: 'fail',
            summary: "Failed to Show",
            detail: `${summary.status}`, //"error" TODO: Check
          })
        }
      }
    })
  }

  calculatePremium() {
    //ratesInfo
    let totalEMpCount = 0
    let totalSpouseCount = 0
    let totalCount = 0
    this.calculatedPremium = 0
    if (this.selectedQuoteTemplate.coverageTypeName != '') {
      let CoverageType = this.selectedQuoteTemplate.coverageTypeName;
      let substrCoverageTypeEmployee = 'E'
      let substrCoverageTypeSpouse = 'S'
      let substrCoverageTypeChild = 'C'
      let substrCoverageTypeSibling = 'L'
      let substrCoverageTypeParent = 'P'
      if (this.selectedQuoteTemplate.coverageTypeName.includes(substrCoverageTypeEmployee)) {
        const sum = this.employeeInfo.reduce((sum, current) => sum + current.selfCount, 0);
        totalEMpCount = totalEMpCount + sum;
      }
      if (this.selectedQuoteTemplate.coverageTypeName.includes(substrCoverageTypeSpouse)) {
        const sum = this.employeeInfo.reduce((sum, current) => sum + current.spouseCount, 0);
        totalEMpCount = totalEMpCount + sum;
      }
      if (this.selectedQuoteTemplate.coverageTypeName.includes(substrCoverageTypeChild)) {
        const sum = this.employeeInfo.reduce((sum, current) => sum + current.childCount, 0);
        totalEMpCount = totalEMpCount + sum;
      }
      if (this.selectedQuoteTemplate.coverageTypeName.includes(substrCoverageTypeSibling)) {
        const sum = this.employeeInfo.reduce((sum, current) => sum + current.siblingsCount, 0);
        totalEMpCount = totalEMpCount + sum;
      }
      if (this.selectedQuoteTemplate.coverageTypeName.includes(substrCoverageTypeParent)) {
        const sum = this.employeeInfo.reduce((sum, current) => sum + current.parentCount, 0);
        totalEMpCount = totalEMpCount + sum;
      }
      if (this.selectedQuoteTemplate.planType == "Floater") {
        if (this.selectedQuoteTemplate.siType == "Flat") {
          this.empRateService.getAllRateTemplate(totalEMpCount).subscribe({
            next: (dto: IManyResponseDto<any>) => {
              this.ratesInfo = dto.data.entities
              if (this.ratesInfo != undefined || this.ratesInfo != null) {
                const SIAmount = this.selectedQuoteTemplate.siFlat
                const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == SIAmount);
                if (ratesASPerSI != undefined) {
                  //Calculate Premium
                  const siRates = ratesASPerSI[0].siRates;
                  this.calculateRateWisePremium(CoverageType, siRates);
                }
              }
              else {
                //this.calculatedPremium = 0
              }
              this.selectedQuoteTemplate.calculatedPremium = this.calculatedPremium;
              const updatePayload = this.selectedQuoteTemplate;
              this.qoutegmctemplateserviceService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
                next: partner => {
                  console.log("ttest");
                },
                error: error => {
                  console.log(error);
                }
              });
              // console.log(data);
            },
            error: e => {
              console.log(e)
            }
          });
        }
        else {
          this.quoteService.empGradewiseDataByQuoteId(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<any>) => {
              this.empDatawithGrades = dto.data.entity.employeeData;
              this.empRateService.getAllRateTemplate(totalEMpCount).subscribe({
                next: (dto: IManyResponseDto<any>) => {
                  this.ratesInfo = dto.data.entities
                  if (this.ratesInfo != undefined || this.ratesInfo != null) {
                    this.selectedQuoteTemplate.gmcGradedSILst.forEach(elementGraded => {
                      let empWithGrades = this.empDatawithGrades.filter(x => x.designation == elementGraded.grade)
                      const SIAmount = +elementGraded.siAmount.label
                      const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == SIAmount);
                      if (ratesASPerSI != undefined) {
                        const siRates = ratesASPerSI[0].siRates;
                        //this.calculatedPremium = 0
                        this.calculateRateWisePremiumGraded(CoverageType, siRates, empWithGrades);
                      }
                    });
                  }
                  else {
                    console.log("------getting 000 here ------")
                    this.calculatedPremium = 0
                  }
                  this.selectedQuoteTemplate.calculatedPremium = this.calculatedPremium;
                  const updatePayload = this.selectedQuoteTemplate;
                  this.qoutegmctemplateserviceService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
                    next: partner => {
                      //console.log("ttest");
                    },
                    error: error => {
                      console.log(error);
                    }
                  });
                },
                error: e => {
                  console.log(e)
                }
              });
              // console.log(data);
            },
            error: e => {
              console.log(e)
            }
          });

        }
      }
      else {
        //Individual
        this.quoteService.empGradewiseDataByQuoteId(this.quote._id).subscribe({
          next: (dto: IOneResponseDto<any>) => {
            this.empDatawithGrades = dto.data.entity.employeeData;
            this.empRateService.getAllRateTemplate(totalEMpCount).subscribe({
              next: (dto: IManyResponseDto<any>) => {
                this.ratesInfo = dto.data.entities
                if (this.ratesInfo != undefined || this.ratesInfo != null) {
                  this.calculateIndividualPremiumGraded(CoverageType, this.ratesInfo, this.empDatawithGrades);
                }
                else {
                  this.calculatedPremium = 0
                }
                this.selectedQuoteTemplate.calculatedPremium = this.calculatedPremium;
                const updatePayload = this.selectedQuoteTemplate;
                this.qoutegmctemplateserviceService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
                  next: partner => {
                    //console.log("ttest");
                  },
                  error: error => {
                    console.log(error);
                  }
                });
              },
              error: e => {
                console.log(e)
              }
            });
            // console.log(data);
          },
          error: e => {
            console.log(e)
          }
        });
      }


      const updatePayload = this.selectedQuoteTemplate

      this.qoutegmctemplateserviceService.updateArray(updatePayload._id, updatePayload).subscribe({
        next: partner => {
          console.log("ttest");
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  calculateRateWisePremium(CoverageType: string, siRates: any) {
    this.calculatedPremium = 0
    let substrCoverageTypeEmployee = 'E'
    let substrCoverageTypeSpouse = 'S'
    let substrCoverageTypeChild = 'C'
    let substrCoverageTypeSibling = 'L'
    let substrCoverageTypeParent = 'P'
    this.employeeInfo.forEach(element => {
      let ageBandWiseRate = []
      if (CoverageType.includes(substrCoverageTypeEmployee)) {
        ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Self'))
      }
      if (CoverageType.includes(substrCoverageTypeSpouse)) {
        ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Spouse'))
      }
      if (CoverageType.includes(substrCoverageTypeChild)) {
        ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Child'))
      }
      if (CoverageType.includes(substrCoverageTypeSibling)) {
        ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Siblings'))
      }
      if (CoverageType.includes(substrCoverageTypeParent)) {
        ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Parent'))
      }
      ageBandWiseRate.forEach(elementAge => {
        switch (elementAge.relation) {
          case 'Self': {
            //statements; 
            if (element.selfCount > 0) {
              this.calculatedPremium = this.calculatedPremium + (element.selfCount * elementAge.premium);
            }
            break;
          }
          case 'Spouse': {
            //statements; 
            if (element.spouseCount > 0) {
              this.calculatedPremium = this.calculatedPremium + (element.spouseCount * elementAge.premium);
            }
            break;
          }
          case 'Child': {
            //statements; 
            if (element.childCount > 0) {
              this.calculatedPremium = this.calculatedPremium + (element.childCount * elementAge.premium);
            }
            break;
          }
          case 'Parent': {
            //statements; 
            if (element.parentCount > 0) {
              let totalParentCount = element.parentCount
              this.calculatedPremium = this.calculatedPremium + (totalParentCount * elementAge.premium);
            }
            break;
          }
          case 'Siblings': {
            //statements; 
            if (element.siblingsCount > 0) {
              this.calculatedPremium = this.calculatedPremium + (element.siblingsCount * elementAge.premium);
            }
            break;
          }
          default: {
            //statements; 
            break;
          }
        }
      });
    });
  }

  calculateIndividualPremiumGraded(CoverageType: string, siRates: any, empWithGrades: any) {
    let substrCoverageTypeEmployee = 'E'
    let substrCoverageTypeSpouse = 'S'
    let substrCoverageTypeChild = 'C'
    let substrCoverageTypeSibling = 'L'
    let substrCoverageTypeParent = 'P'

    let ageBandWiseRate = []
    if (CoverageType.includes(substrCoverageTypeEmployee)) {
      let allEmp = empWithGrades.filter(x => x.relationShip == 'Self');
      allEmp.forEach(elementE => {
        const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
        if (ratesASPerSI != undefined) {
          const siRates = ratesASPerSI[0].siRates;
          ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
            x.relation == 'Self'))
        }
      });

    }

    if (CoverageType.includes(substrCoverageTypeSpouse)) {
      let allEmp = empWithGrades.filter(x => x.relationShip == 'Spouse');
      allEmp.forEach(elementE => {
        const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
        if (ratesASPerSI != undefined) {
          const siRates = ratesASPerSI[0].siRates;
          ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
            x.relation == 'Spouse'))
        }
      });
    }

    if (CoverageType.includes(substrCoverageTypeChild)) {
      let allEmp = empWithGrades.filter(x => x.relationShip == 'Child');
      allEmp.forEach(elementE => {
        const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
        if (ratesASPerSI != undefined) {
          const siRates = ratesASPerSI[0].siRates;
          ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
            x.relation == 'Child'))
        }
      });
    }

    if (CoverageType.includes(substrCoverageTypeSibling)) {
      let allEmp = empWithGrades.filter(x => x.relationShip == 'Siblings');
      allEmp.forEach(elementE => {
        const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
        if (ratesASPerSI != undefined) {
          const siRates = ratesASPerSI[0].siRates;
          ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
            x.relation == 'Siblings'))
        }
      });
    }
    if (CoverageType.includes(substrCoverageTypeParent)) {
      let allEmp = empWithGrades.filter(x => x.relationShip == 'Parent');
      allEmp.forEach(elementE => {
        const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
        if (ratesASPerSI != undefined) {
          const siRates = ratesASPerSI[0].siRates;
          ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
            x.relation == 'Parent'))
        }
      });
    }

    this.calculatedPremium = 0
    console.log(ageBandWiseRate)
    ageBandWiseRate.forEach(elementAge => {
      switch (elementAge.relation) {
        case 'Self': {
          //statements; 
          this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);

          break;
        }
        case 'Spouse': {
          //statements; 
          this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);

          break;
        }
        case 'Child': {
          //statements; 
          this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);

          break;
        }
        case 'Parent': {
          //statements; 
          this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);

          break;
        }
        case 'Siblings': {
          //statements; 
          this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);

          break;
        }
        default: {
          //statements; 
          break;
        }
      }
    });


  }

  calculateRateWisePremiumGraded(CoverageType: string, siRates: any, empWithGrades: any) {
    let substrCoverageTypeEmployee = 'E'
    let substrCoverageTypeSpouse = 'S'
    let substrCoverageTypeChild = 'C'
    let substrCoverageTypeSibling = 'L'
    let substrCoverageTypeParent = 'P'

    let selfCount = 0;
    let spouseCount = 0;
    let childCount = 0;
    let parentCount = 0;
    let siblingCount = 0;

    if (CoverageType.includes(substrCoverageTypeEmployee)) {
      selfCount = empWithGrades.filter(x => x.relationShip == 'Self').length;
    }
    if (CoverageType.includes(substrCoverageTypeSpouse)) {
      spouseCount = empWithGrades.filter(x => x.relationShip == 'Spouse').length;
    }
    if (CoverageType.includes(substrCoverageTypeChild)) {
      childCount = empWithGrades.filter(x => x.relationShip == 'Child').length;
    }
    if (CoverageType.includes(substrCoverageTypeSibling)) {
      siblingCount = empWithGrades.filter(x => x.relationShip == 'Siblings').length;
    }
    if (CoverageType.includes(substrCoverageTypeParent)) {
      parentCount = empWithGrades.filter(x => x.relationShip == 'Parent').length;
    }


    empWithGrades.forEach(element => {
      let ageBandWiseRate = []
      if (element.relationShip == 'Self') {
        if (CoverageType.includes(substrCoverageTypeEmployee)) {
          ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo &&
            x.relation == 'Self'))
        }
      }
      if (element.relationShip == 'Spouse') {
        if (CoverageType.includes(substrCoverageTypeSpouse)) {
          ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo &&
            x.relation == 'Spouse'))
        }
      }
      if (element.relationShip == 'Child') {
        if (CoverageType.includes(substrCoverageTypeChild)) {
          ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo &&
            x.relation == 'Child'))
        }
      }
      if (element.relationShip == 'Siblings') {
        if (CoverageType.includes(substrCoverageTypeSibling)) {
          ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo &&
            x.relation == 'Siblings'))
        }
      }
      if (element.relationShip == 'Parent') {
        if (CoverageType.includes(substrCoverageTypeParent)) {
          ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo &&
            x.relation == 'Parent'))
        }
      }
      //this.calculatedPremium = 0
      console.log(ageBandWiseRate)
      ageBandWiseRate.forEach(elementAge => {
        switch (elementAge.relation) {
          case 'Self': {
            //statements; 
            if (selfCount != undefined) {
              this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
            }
            break;
          }
          case 'Spouse': {
            //statements; 
            if (spouseCount != undefined) {
              this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
            }
            break;
          }
          case 'Child': {
            //statements; 
            if (childCount != undefined) {
              this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
            }
            break;
          }
          case 'Parent': {
            //statements; 
            if (parentCount != undefined) {
              this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
            }
            break;
          }
          case 'Siblings': {
            //statements; 
            if (siblingCount != undefined) {
              this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
            }
            break;
          }
          default: {
            //statements; 
            break;
          }
        }
      });
    });
    console.log(this.calculatedPremium)
  }

  removeTextInfo(itemquestion) {
    itemquestion.freeTextValue = '';
    itemquestion.freeText = !itemquestion.freeText;
  }
}
