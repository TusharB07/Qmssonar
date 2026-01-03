import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Subscription } from 'rxjs';
import { PermissionType, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IGMCTemplate, GMCTemplate, AllowedGMCPARENTabsTypes } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { IQuoteSlip, IQuoteGmcTemplate, GmcClaimExperience, BasicDetailsAttachments, CoverageDetails, Installment } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-gmc-otherdetails-tab',
  templateUrl: './gmc-otherdetails-tab.component.html',
  styleUrls: ['./gmc-otherdetails-tab.component.scss']
})
export class GmcOtherdetailsTabComponent implements OnInit {
  ddlText: string = ""
  showCoverageLimit: boolean = true
  tabsData: IGMCTemplate = new GMCTemplate();
  quote: IQuoteSlip;
  @Input() permissions: PermissionType[] = ['create', 'read', 'update', 'delete']
  uploadDaycareUrl: string;
  uploadHttpHeaders: HttpHeaders;
  subsidairyAttachment: BasicDetailsAttachments[] = []
  isModalVisible: boolean = false;
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
        this.uploadDaycareUrl = this.gmcQuoteTemplateService.DayCareUploadUrl(this.selectedQuoteTemplate?._id);
        this.tabsData = template.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.OTHERDETAILS)[0]
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
    this.uploadDaycareUrl = this.gmcQuoteTemplateService.DayCareUploadUrl(this.selectedQuoteTemplate?._id);

    console.log(this.tabsData);
  }


  addInstallment() {
    this.selectedQuoteTemplate.otherDetailsInstallment.push({
      number: `${this.selectedQuoteTemplate.otherDetailsInstallment.length + 1}th`,
      date: '',
      premium: 0
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
  saveTabs() {
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

    let selectedAnswer = changedQuestion.answer.find((a: any) => a._id === changedQuestion.selectedAnswer);
    if (changedQuestion.inputControl == 'radiobutton') {
      selectedAnswer = changedQuestion.answer.find((x: any) => x.answer === changedQuestion.selectedAnswer);
    }
    // If the selected answer is "Not Covered", recursively deactivate child questions
    if (selectedAnswer && (selectedAnswer.answer === "Not Covered" || selectedAnswer && selectedAnswer.answer === "No")) {
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

  addRow() {
    this.selectedQuoteTemplate.gradedFormData.push({ grade: '', sumInsured: '', additionalColumn: '' });
  }

  setNoInstallments(selectedAnswer: number) {
    if (selectedAnswer == 0) {
      this.selectedQuoteTemplate.otherDetailsInstallment = []
    }
    else {
      let currentLength = this.selectedQuoteTemplate.otherDetailsInstallment.length;
      if (selectedAnswer < currentLength) {
        //Remove difference from this.selectedQuoteTemplate.otherDetailsInstallment
        // Remove excess installments
        this.selectedQuoteTemplate.otherDetailsInstallment.splice(selectedAnswer);
      }
      else {
        // Add missing installments
        for (let i = currentLength; i < selectedAnswer; i++) {
          this.addInstallment();
        }
      }
    }
  }

  onRadioSelection(answerSelected: any, itemquestion: any, gmcQuestionAnswers: any) {

    const selectedAnswer = itemquestion.answer.find((x: any) => x.answer === itemquestion.selectedAnswer);
    this.ddlText = selectedAnswer ? selectedAnswer.answer.trim() : "";

    // Update the isSelected flag for answers
    itemquestion.answer.forEach((element: any) => {
      element.isSelected = element._id === selectedAnswer._id;
    });
    // Update question visibility and states
    this.updateQuestionStates(gmcQuestionAnswers, itemquestion);

    // Optionally call a visibility handler if needed
    this.updateQuestionVisibility(gmcQuestionAnswers, itemquestion);

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

    if (this.ddlText == 'Yes') {
      this.isModalVisible = true; // Open the modal
    }
    else {
      this.isModalVisible = false; // Open the modal
      this.selectedQuoteTemplate.otherDetailsInstallment = []
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
                (x) => x.parentTabName === AllowedGMCPARENTabsTypes.OTHERDETAILS
              );

              if (!baseQuoteData) {
                console.error("Family Composition data not found in base option.");
                return;
              }
              // Replace only FAMILYCOMPOSITION in selectedQuoteTemplate
              const updatedGmcTemplateData = this.selectedQuoteTemplate.gmcTemplateData.map((item) => {
                if (item.parentTabName === AllowedGMCPARENTabsTypes.OTHERDETAILS) {
                  return baseQuoteData; // Replace with baseFamilyComposition
                }
                return item; // Keep other items unchanged
              });

              // Update the selectedQuoteTemplate object
              this.selectedQuoteTemplate = {
                ...this.selectedQuoteTemplate,
                gmcTemplateData: updatedGmcTemplateData,
              };
              this.tabsData = this.selectedQuoteTemplate.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.OTHERDETAILS)[0]

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
