import { Component, OnInit } from '@angular/core';
import { GmcCoverageOptions, IGmcCoverageOptions, IQuoteGmcOptions } from './gmc-coverage-options.model';
import { Subscription } from 'rxjs';
import { IQuoteGmcTemplate, IQuoteSlip, QuoteGmcTemplate } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { GmcOptionsService } from './gmc-options.service';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-gmc-coverages-options-dialog',
  templateUrl: './gmc-coverages-options-dialog.component.html',
  styleUrls: ['./gmc-coverages-options-dialog.component.scss']
})
export class GmcCoveragesOptionsDialogComponent implements OnInit {
  isAdded: boolean = false;
  isNew: boolean = false;
  coverageOptions: IGmcCoverageOptions
  quoteGmcOptions: IQuoteGmcOptions;
  quoteGmcOptionsLst: IQuoteGmcTemplate[];
  quoteGmcOptionsModel: QuoteGmcTemplate = new QuoteGmcTemplate()
  coverageOptionsLst: GmcCoverageOptions[] = []
  quote: IQuoteSlip;
  quoteId: string = ""
  selectedExpiredOption: string | null = null; // Track the currently expired option


  selectedMergeOption: IQuoteGmcTemplate | null = null; // Selected option for merging
  mergeOptions: any[] = []; // Dropdown options for merging
  expiredOptionAvailable: boolean = false; // Flag for expired option availability

  private currentQuote: Subscription;
  constructor(private quoteService: QuoteService, private gmcOptionsService: GmcOptionsService, private messageService: MessageService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quoteId = this.quote._id;
        // console.log(this.quote);
      }
    })
    this.getOptions();
  }

  ngOnInit(): void {
    this.coverageOptions = new GmcCoverageOptions();
    //this.getOptions();
  }
  deleteOptions(optionModel: IQuoteGmcTemplate, index: number) {
    // Remove the selected option from the list
    if (index != 0) {
      this.quoteGmcOptionsLst.splice(index, 1);

      // Update the optionIndex and optionName for each remaining option
      this.quoteGmcOptionsLst.forEach((itemCover, i) => {
        itemCover.optionIndex = i + 1;
        if(itemCover.isExpired){
          itemCover.optionName = `Expiry`;
        }else{
          itemCover.optionName = `Option ${i + 1}`;
        }
      });
      if (optionModel._id != undefined) {
        this.gmcOptionsService.delete(optionModel._id).subscribe({
          next: quote => {
            this.quoteGmcOptionsLst.forEach(element => {
              this.gmcOptionsService.update(element._id, element).subscribe({
                next: quote => {
                  //console.log("Option Added Successfully");
                  // console.log("ttest");
                  this.isAdded = false;
                  this.getOptions();
                }, error: error => {
                  console.log(error);
                }
              });
            });
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: `Option Deleted Successfully`,
              life: 3000
            });
          }, error: error => {
            console.log(error);
          }
        });
      }
      else {
        this.isAdded = !this.isAdded;
      }

    }

  }

  getOptions() {
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.quoteGmcOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion);
        this.loadOptionsData(dto.data.entity) //.map(entity => ({ label: entity.optionName, value: entity._id })))
        this.loadSelectedOption(this.quoteGmcOptionsLst[0])

         // Prepare dropdown options for merging
         this.mergeOptions = this.quoteGmcOptionsLst.filter(x=>x.optionName !== 'Expiry').map(option => ({
          label: option.optionName,
          value: option,
        }));
        this.expiredOptionAvailable = !!this.quoteGmcOptionsLst.find(opt => opt.isExpired);

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
  addMoreOptions() {

    this.quoteGmcOptionsModel = new QuoteGmcTemplate();
    this.quoteGmcOptionsModel.optionName = "Option " + (+this.quoteGmcOptionsLst.length + 1)
    this.quoteGmcOptionsModel.optionIndex = (+this.quoteGmcOptionsLst.length + 1)
    let OptionIndex = 1
    this.quoteGmcOptionsLst.forEach(element => {
      this.quoteGmcOptionsModel.options.push("Replicate Coverege as Option" + OptionIndex)
      OptionIndex++;
    });
    this.quoteGmcOptionsModel.isExpired = false;
    this.quoteGmcOptionsModel.selectedFromOptionNo = ""
    this.quoteGmcOptionsLst.push(this.quoteGmcOptionsModel);
  }
  OptionChanged(optionChanged: GmcCoverageOptions, event: any) {
    if (event.checked) {
      optionChanged.selectedOption = optionChanged.options[0];
      //optionChanged.gmcTemplateData = this.quote.gmcTemplateDataId["gmcTemplateData"]
      console.log(optionChanged)
    }
    else {
      optionChanged.selectedOption = ""
      optionChanged.gmcTemplateData = null
      console.log(optionChanged)
    }
  }
  SaveOptions() {
    this.isAdded = false
    this.gmcOptionsService.create(this.quoteGmcOptionsModel).subscribe({
      next: quote => {
        //console.log("Option Added Successfully");
        // console.log("ttest");
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: `Option Added Successfully`,
          life: 3000
        });
        this.getOptions();

      },
      error: error => {
        console.log(error);
      }
    });
  }

  onExpiredOptionChange(itemCover: any) {
    // Update each option's state
    this.quoteGmcOptionsLst.forEach((item) => {
      if (item.optionName === "Expiry") {
        // Rename the previously expired option back to its default name
        item.optionName = "Option " + item.optionIndex;
      }
    });
  
    this.quoteGmcOptionsLst.forEach((item) => {
      // Mark the selected option as expired
      if (item.optionName === itemCover.optionName) {
        item.optionName = "Expiry";
        item.isExpired = true;
      } else {
        item.isExpired = false;
      }
    });

    this.quoteGmcOptionsLst.forEach(element => {
      if (itemCover._id != undefined) {
        this.gmcOptionsService.update(element._id, element).subscribe({
          next: quote => {

          this.getOptions();

          },
          error: error => {
            console.log(error);
          }
        });
      }
    });
    this.messageService.add({
      severity: "success",
      summary: "Successful",
      detail: `Option Updated Successfully`,
      life: 3000
    });
  }

  mergeOptionsWithExpired() {
    if (!this.selectedMergeOption || !this.expiredOptionAvailable) return;
  
    // Find the expired option
    const expiredOption = this.quoteGmcOptionsLst.find(opt => opt.isExpired);
  
    if (expiredOption) {
      console.log(expiredOption)
      console.log(this.selectedMergeOption)
      // Create a new option as a clone of the selected option
      const newOption: IQuoteGmcTemplate = {
        ...this.selectedMergeOption,
        _id: undefined, // New option should not have an ID
        optionName: `Option ${this.quoteGmcOptionsLst.length + 1}`,
        optionIndex: this.quoteGmcOptionsLst.length + 1,
      };
  
      // Compare and merge `gmcQuestionAnswers`
      newOption.gmcTemplateData = this.mergeGmcTemplateData(
        expiredOption.gmcTemplateData,
        this.selectedMergeOption.gmcTemplateData
      );
  
      // Update the expired option with selected option's template data
      expiredOption.gmcTemplateData = this.mergeGmcTemplateData(
        this.selectedMergeOption.gmcTemplateData,
        expiredOption.gmcTemplateData
      );
  
      // Push the new option into the list
      //this.quoteGmcOptionsLst.push(newOption);
  
      // Save the changes to the server
      //this.saveMergedOptions();
    this.isAdded = false
    this.gmcOptionsService.create(newOption).subscribe({
      next: quote => {
        //console.log("Option Added Successfully");
        // console.log("ttest");
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: `Option Added Successfully`,
          life: 3000
        });
        this.getOptions();

      },
      error: error => {
        console.log(error);
      }
    });
    }
  }
  mergeGmcTemplateData(
    sourceTemplateData: IGMCTemplate[],
    targetTemplateData: IGMCTemplate[]
  ): IGMCTemplate[] {
    return sourceTemplateData.map((sourceTemplate, index) => {
      const targetTemplate = targetTemplateData[index];
  
      return {
        ...sourceTemplate,
        gmcSubTab: sourceTemplate.gmcSubTab.map((sourceSubTab, subTabIndex) => {
          const targetSubTab = targetTemplate.gmcSubTab?.[subTabIndex];
  
          return {
            ...sourceSubTab,
            gmcLabelForSubTab: sourceSubTab.gmcLabelForSubTab.map(
              (sourceLabel, labelIndex) => {
                const targetLabel = targetSubTab.gmcLabelForSubTab?.[labelIndex];
  
                return {
                  ...sourceLabel,
                  gmcQuestionAnswers: sourceLabel.gmcQuestionAnswers.map(
                    (sourceQuestion, questionIndex) => {
                      const targetQuestion = targetLabel.gmcQuestionAnswers?.[questionIndex];
  
                      // Compare and merge question answers
                      return {
                        ...sourceQuestion,
                        selectedAnswer: targetQuestion.selectedAnswer || sourceQuestion.selectedAnswer,
                        freeTextValue: targetQuestion.freeTextValue || sourceQuestion.freeTextValue,
                      };
                    }
                  ),
                };
              }
            ),
          };
        }),
      };
    });
  }
  
  saveMergedOptions() {
    this.quoteGmcOptionsLst.forEach(option => {
      this.gmcOptionsService.update(option._id, option).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Merge Successful",
            detail: "Options merged successfully.",
            life: 3000,
          });
          this.getOptions();
        },
        error: error => {
          console.log(error);
        }
      });
    });
  }
  onRadioChange(no: any) {
    let temptoAdd = this.quoteGmcOptionsLst.filter(x => x.optionName == 'Option ' + no)[0]
    this.quoteGmcOptionsModel.employeeDemographic = temptoAdd.employeeDemographic
    this.quoteGmcOptionsModel.finalRater = temptoAdd.finalRater
    this.quoteGmcOptionsModel.gmcGradedSILst = temptoAdd.gmcGradedSILst
    this.quoteGmcOptionsModel.gmcTemplateData = temptoAdd.gmcTemplateData
    this.quoteGmcOptionsModel.quoteId = temptoAdd.quoteId;
    this.quoteGmcOptionsModel.claimExperience = temptoAdd.claimExperience;
    this.quoteGmcOptionsModel.siFlat = temptoAdd.siFlat;
    this.quoteGmcOptionsModel.siType = temptoAdd.siType;
    this.quoteGmcOptionsModel.isAccepted = temptoAdd.isAccepted;
    this.quoteGmcOptionsModel.indicativePremium = temptoAdd.indicativePremium;
    this.quoteGmcOptionsModel.totalFinalRater = temptoAdd.totalFinalRater;
    this.quoteGmcOptionsModel.brokarage = temptoAdd.brokarage;
    this.quoteGmcOptionsModel.otherTerms = temptoAdd.otherTerms;
    this.quoteGmcOptionsModel.coverageTypeId = temptoAdd.coverageTypeId;
    this.quoteGmcOptionsModel.coverageTypeName = temptoAdd.coverageTypeName;
    this.quoteGmcOptionsModel.calculatedPremium = temptoAdd.calculatedPremium;
    this.quoteGmcOptionsModel.planType = temptoAdd.planType
    this.quoteGmcOptionsModel.version = this.quote.qcrVersion
    this.quoteGmcOptionsModel.gmcBasicDetails = temptoAdd.gmcBasicDetails
    this.quoteGmcOptionsModel.gradedFormDataMultiple = temptoAdd.gradedFormDataMultiple
    this.quoteGmcOptionsModel.gradedFormData = temptoAdd.gradedFormData
    this.quoteGmcOptionsModel.gpaGtlFormDetails = temptoAdd.gpaGtlFormDetails
    this.quoteGmcOptionsModel.otherDetailsInstallment = temptoAdd.otherDetailsInstallment
    this.quoteGmcOptionsModel.isExpired = false;
    this.quoteGmcOptionsModel.showClaimHistory = temptoAdd.showClaimHistory
    this.quoteGmcOptionsModel.topUpType = temptoAdd.topUpType,
    this.quoteGmcOptionsModel.policyStartDate= temptoAdd.policyStartDate,
    this.quoteGmcOptionsModel.policyEndDate= temptoAdd.policyStartDate
  }
}
