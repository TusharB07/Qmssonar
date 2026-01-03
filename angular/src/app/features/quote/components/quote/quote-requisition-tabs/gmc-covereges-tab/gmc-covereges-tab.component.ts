import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Subscription } from 'rxjs';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedGMCPARENTabsTypes, GMCTemplate, IGMCQuestionAnswers, IGMCSubTab, IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { BasicDetailsAttachments, CoverageDetails, IGmcDataModel, IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-gmc-covereges-tab',
  templateUrl: './gmc-covereges-tab.component.html',
  styleUrls: ['./gmc-covereges-tab.component.scss']
})
export class GmcCoveregesTabComponent implements OnInit {
  ddlText: string = ""
  showCoverageLimit: boolean = true
  tabsData: IGMCTemplate = new GMCTemplate();
  quote: IQuoteSlip;
  @Input() permissions: PermissionType[] = ['create', 'read', 'update', 'delete']
  uploadDaycareUrl: string;
  selectedAnswer: any
  uploadHttpHeaders: HttpHeaders;
  subsidairyAttachment: BasicDetailsAttachments[] = []
  isModalVisible: boolean = false;
  isModalVisible2: boolean = false;
  showGragedButton1: boolean = false;
  showGragedButton2: boolean = false;
  private currentQuote: Subscription;
  private currentSelectedTemplate: Subscription;
  selectedQuoteTemplate: IQuoteGmcTemplate;
  constructor(private accountService: AccountService, private quoteService: QuoteService, private gmcQuoteTemplateService: QoutegmctemplateserviceService, private messageService: MessageService) {
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        // console.log(this.quote);

      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.selectedQuoteTemplate = template;
        //this.uploadDaycareUrl = this.gmcQuoteTemplateService.DayCareUploadUrl(this.selectedQuoteTemplate?._id);
        this.tabsData = template.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.COVERAGES)[0]

        this.tabsData.gmcSubTab.forEach(element => {
          element.gmcLabelForSubTab.forEach(elementSubTab => {
            elementSubTab.gmcQuestionAnswers.forEach(elementQues => {
              if (elementQues?.question?.toLowerCase().trim() == 'sum insured basis') {
                const selectedAnswer = elementQues?.answer.find((x: any) => x._id === elementQues?.selectedAnswer);
                this.ddlText = selectedAnswer ? selectedAnswer.answer.trim() : "";
                if (this.ddlText == 'Graded') {
                  this.isModalVisible = true; // Open the modal
                  this.showGragedButton1 = true;
                }
                else {
                  this.isModalVisible = false; // Open the modal
                  this.showGragedButton1 = false;
                  this.selectedQuoteTemplate.gradedFormData = []
                }
              }
              if (elementQues?.question?.toLowerCase().trim() == 'restriction on') {
                if (elementQues?.selectedAnswer != 0) {
                  if (Array.isArray(elementQues?.selectedAnswer)) {
                    const selectedAnswer = elementQues?.selectedAnswer.some((x: any) => x.answer === 'Grade');
                    if (selectedAnswer) {
                      this.isModalVisible2 = true; // Open the modal
                    }
                  }
                }
              }

              if (elementQues?.question?.toLowerCase().trim() == 'sum insured amount') {
                elementQues.selectedAnswer = this.selectedQuoteTemplate.siFlat
              }
            });
          });
        });



        this.subsidairyAttachment = []
        if (this.selectedQuoteTemplate.dayCareFilePath != null && this.selectedQuoteTemplate.dayCareFilePath != ''
          && this.selectedQuoteTemplate.dayCareFilePath != null && this.selectedQuoteTemplate.dayCareFilePath != ''
        ) {
          this.subsidairyAttachment = []
          var attachment = new BasicDetailsAttachments();
          attachment.filePath = this.selectedQuoteTemplate.dayCareFilePath;
          attachment.fileName = this.selectedQuoteTemplate.dayCareFileName;
          attachment.id = this.selectedQuoteTemplate._id;
          attachment.quoteId = this.quote._id;
          attachment.templateId = this.selectedQuoteTemplate._id;

          this.subsidairyAttachment.push(attachment);
        }
      }
    })
  }

  ngOnInit(): void {
    //this.uploadDaycareUrl = this.gmcQuoteTemplateService.DayCareUploadUrl(this.selectedQuoteTemplate?._id);

    console.log(this.tabsData);
  }


  deleteRow(index: number) {
    this.selectedQuoteTemplate.gradedFormData.splice(index, 1);
}

  validateSubTab(subTab: IGMCSubTab): boolean {
    return subTab.gmcLabelForSubTab?.every((label) =>
      this.validateQuestionAnswers(label.gmcQuestionAnswers)
    ) ?? false; // Ensure it doesn't break if gmcLabelForSubTab is undefined
  }

  validateTemplate(template: IGMCTemplate): boolean {
    return template.gmcSubTab?.every((subTab) => this.validateSubTab(subTab)) ?? false;
  }

  validateQuestionAnswers(questions: IGMCQuestionAnswers[]): boolean {
    return questions.every((question) => {
      if (question.isQuestionRequired) {
        if (question.inputControl === "dropdown") {
          return question.selectedAnswer !== null && question.selectedAnswer !== undefined; // Ensure a valid selection
        }
        else if (question.inputControl === "radiobutton") {
          return question.selectedAnswer == 0
        }
        // else if (question.inputControl === "multiselectdropdown") {
        //   return Array.isArray(question.selectedMultipleAnswer) && question.selectedMultipleAnswer.length > 0;
        // }       
      }
      return true; // If not required, consider it valid
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
            : element.answer.some(x => x.answer === 'Not Applicable') ? "Not applicable"
            : element.answer.some(x => x.answer === 'Waived off') ? "Waived off"
              : 0;
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
  saveTabs() {
    const isTemplateValid = this.validateTemplate(this.tabsData);
    if (false) {
      console.log("Validation failed: Required questions are not answered.");
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: `Please fill in all the mandatory fields before proceeding`,
        life: 3000
      });
    } else {
      console.log("Validation passed.");
      const updatePayload = this.selectedQuoteTemplate

      this.gmcQuoteTemplateService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
        next: partner => {
          // console.log("ttest");
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Successful",
          //   detail: `Saved`,
          //   life: 3000
          // });
        },

        error: error => {
          console.log(error);
        }
      });
    }

  }


  onUploadSDayCareFile() {
    this.quoteService.get(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quoteService.setQuote(dto.data.entity)
        this.getOptions()

      },
      error: e => {
        console.log(e);
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

  errorHandler(e, uploader: FileUpload) {
    uploader.remove(e, 0)
  }

  deleteDayCareReport() {
    this.gmcQuoteTemplateService.DayCareDelete(this.selectedQuoteTemplate._id).subscribe({
      next: () => {
        this.quoteService.get(this.quote._id).subscribe({
          next: (dto: IOneResponseDto<IQuoteSlip>) => {
            // console.log(dto.data.entity)
            this.quoteService.setQuote(dto.data.entity)
            this.getOptions()
          },
          error: e => {
            console.log(e);
          }
        });
      }
    })
  }

  downloadSubsidiaryauditedfinancialReport() {
    this.gmcQuoteTemplateService.DayCareDownload(this.selectedQuoteTemplate._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy audited financial Report';

        const a = document.createElement('a')
        const blob = new Blob([response.body], { type: response.headers.get('content-type') });
        const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
        const objectUrl = window.URL.createObjectURL(file);

        // a.href = objectUrl
        // a.download = fileName;
        // a.click();

        window.open(objectUrl, '_blank');

        URL.revokeObjectURL(objectUrl);

      }
    })
  }



  downloadFileSubsidiaryauditedfinancialReport() {
    this.gmcQuoteTemplateService.DayCareDownload(this.selectedQuoteTemplate._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy audited financial Report';

        const a = document.createElement('a')
        const blob = new Blob([response.body], { type: response.headers.get('content-type') });
        const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
        const objectUrl = window.URL.createObjectURL(file);

        a.href = objectUrl
        a.download = fileName;
        a.click();


      }
    })
  }

  removeTextInfo(itemquestion) {
    itemquestion.freeTextValue = '';
    itemquestion.freeText = !itemquestion.freeText;
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
    if (itemquestion?.question?.toLowerCase().trim() == 'restriction on') {
      if (itemquestion?.selectedAnswer != 0) {
        const selectedAnswer = itemquestion?.selectedAnswer.some((x: any) => x.answer === 'Grade');
        if (selectedAnswer) {
          this.isModalVisible2 = true; // Open the modal
        }
        else {
          this.isModalVisible2 = false; // Open the modal
        }
      }
      else {
        this.isModalVisible2 = false; // Open the modal
      }
    }
  }

  addRow() {
    this.selectedQuoteTemplate.gradedFormData.push({ grade: '', sumInsured: '', additionalColumn: '' });
  }
  openGradedInfo(itemquestion: any) {
    if (itemquestion.question.trim() == 'Sum Insured Basis') {
      const selectedAnswer = itemquestion.answer.find((x: any) => x._id === itemquestion.selectedAnswer);
      this.ddlText = selectedAnswer ? selectedAnswer.answer.trim() : "";
      if (this.ddlText == 'Graded') {
        this.isModalVisible = true; // Open the modal
      }
      else { return false; }
    }
    else if (itemquestion.question.trim() == 'Restriction on') {
      if (itemquestion.selectedAnswer != 0) {
        const selectedAnswer = itemquestion.selectedAnswer.some((x: any) => x.answer === 'Grade');
        if (selectedAnswer) {
          this.isModalVisible2 = true; // Open the modal
        }
      }
    }
    return false;
  }

  showGradedButton(itemquestion: any) {
    if (itemquestion.question.trim() == 'Sum Insured Basis') {
      const selectedAnswer = itemquestion.answer.find((x: any) => x._id === itemquestion.selectedAnswer);
      this.ddlText = selectedAnswer ? selectedAnswer.answer.trim() : "";
      if (this.ddlText == 'Graded') {
        return true;
      }
    } else if (itemquestion.question.trim() == 'Restriction on') {
      if (itemquestion.selectedAnswer != 0) {
        const selectedAnswer = itemquestion.selectedAnswer.some((x: any) => x.answer === 'Grade');
        if (selectedAnswer) {
          return true;
        }
      }
    }
    return false;
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
    if (itemquestion?.question.toLowerCase().trim() == 'sum insured basis') {
      if (this.ddlText == 'Graded') {
        this.isModalVisible = true; // Open the modal
        this.showGragedButton1 = true;
      }
      else {
        this.isModalVisible = false; // Open the modal
        this.showGragedButton1 = false;
        this.selectedQuoteTemplate.gradedFormData = []
      }
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
              const baseQuoteData = baseOption.gmcTemplateData.find(
                (x) => x.parentTabName === AllowedGMCPARENTabsTypes.COVERAGES
              );

              if (!baseQuoteData) {
                console.error("Family Composition data not found in base option.");
                return;
              }
              // Replace only FAMILYCOMPOSITION in selectedQuoteTemplate
              const updatedGmcTemplateData = this.selectedQuoteTemplate.gmcTemplateData.map((item) => {
                if (item.parentTabName === AllowedGMCPARENTabsTypes.COVERAGES) {
                  return baseQuoteData; // Replace with baseFamilyComposition
                }
                return item; // Keep other items unchanged
              });

              // Update the selectedQuoteTemplate object
              this.selectedQuoteTemplate = {
                ...this.selectedQuoteTemplate,
                gmcTemplateData: updatedGmcTemplateData,
              };
              this.tabsData = this.selectedQuoteTemplate.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.COVERAGES)[0]

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
}
