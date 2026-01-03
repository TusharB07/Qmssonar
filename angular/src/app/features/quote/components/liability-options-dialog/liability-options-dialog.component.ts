import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CGLTemplate, DANDOTemplate, EandOTemplate, ICGLTemplate, IDANDOTemplate, IEandOTemplate, IProductLiabilityTemplate, IQuoteSlip, IWCTemplate, ProductLiabilityTemplate, WCTemplate } from 'src/app/features/admin/quote/quote.model';
import { LiabilityCoveragesOptions, ILiabilityCoveragesOptions, IQuoteLiabilityOptions } from './ploptions.model';
import { IOneResponseDto } from 'src/app/app.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';

import { MessageService } from 'primeng/api';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-liability-options-dialog',
  templateUrl: './liability-options-dialog.component.html',
  styleUrls: ['./liability-options-dialog.component.scss']
})
export class LiabilityOptionsDialogComponent implements OnInit {

  isAdded: boolean = false;
  isNew: boolean = false;
  coverageOptions: ILiabilityCoveragesOptions
  quoteLiabilityOptions: ILiabilityCoveragesOptions;
  quoteOptionsLst: any[];
  quoteOptionsModel: any
  coverageOptionsLst: LiabilityCoveragesOptions[] = []
  quote: IQuoteSlip;
  quoteId: string = ""
  private currentQuote: Subscription;
  templateName: string = ""
  templateData: any
  liabilityService: any
  cglTemplate: ICGLTemplate
  productTemplate: IProductLiabilityTemplate
  eandoTemplate: IEandOTemplate
  liabilityTemplate: IDANDOTemplate
  wcTemplate: IWCTemplate
  mergeOptions: any[] = []; // Dropdown options for merging
  expiredOptionAvailable: boolean = false; // Flag for expired option availability
  selectedMergeOption: any; // Selected option for merging
  selectedExpiredOption: string | null = null; // Track the currently expired option
  isExpiryDisable: boolean = true
  templateSelected: boolean = false;
  routeToDraft: boolean = false
  constructor(private quoteService: QuoteService, private optionsServiceEandO: liabilityEandOTemplateService,
    private optionsServiceCGLPublic: liabilityCGLTemplateService,
    private optionsServiceProductCyber: liabilityProductTemplateService,
    private optionsServiceDandOCrime: liabilityTemplateService,
    private optionsServiceWC: QuoteWcTemplateService,
    private routerService: Router,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    const data = this.config.data;
    this.routeToDraft = data.routeToDraft;
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
        this.quoteId = this.quote._id;
        if (this.quote?.productId) {
          this.templateName = this.quote?.productId["productTemplate"]
          switch (this.templateName) {
            case AllowedProductTemplate.LIABILITY_CGL:
            case AllowedProductTemplate.LIABILITY_PUBLIC:
              this.selectedMergeOption = this.cglTemplate
              this.templateData = this.quote.liabilityCGLTemplateDataId
              this.liabilityService = optionsServiceCGLPublic
              break;
            case AllowedProductTemplate.LIABILITY_PRODUCT:
            case AllowedProductTemplate.LIABILITY_CYBER:
              this.selectedMergeOption = this.productTemplate
              this.templateData = this.quote.liabilityProductTemplateDataId
              this.liabilityService = optionsServiceProductCyber
              break;
            case AllowedProductTemplate.LIABILITY:
            case AllowedProductTemplate.LIABILITY_CRIME:
              this.selectedMergeOption = this.liabilityTemplate
              this.templateData = this.quote.liabilityTemplateDataId
              this.liabilityService = optionsServiceDandOCrime
              break;
            case AllowedProductTemplate.LIABILITY_EANDO:
              this.selectedMergeOption = this.eandoTemplate
              this.templateData = this.quote.liabilityEandOTemplateDataId
              this.liabilityService = optionsServiceEandO
              break;
            case AllowedProductTemplate.WORKMENSCOMPENSATION:
              this.selectedMergeOption = this.wcTemplate
              this.templateData = this.quote.wcTemplateDataId
              this.liabilityService = optionsServiceWC
              break;
            default:
              console.error('Unsupported product template:', this.templateName);
              break;
          }

        }

        // console.log(this.quote);
      }
    })
    this.getOptions();
  }

  ngOnInit(): void {
    this.coverageOptions = new LiabilityCoveragesOptions();
    //this.getOptions();
  }

  mergeWCTemplate(
    sourceTemplateData: any,
    targetTemplateData: any
  ): any {
    return {
      // Basic fields
      quoteId: sourceTemplateData.quoteId || targetTemplateData.quoteId,

      insuredBusinessActivityId: sourceTemplateData.insuredBusinessActivityId || targetTemplateData.insuredBusinessActivityId,
      insuredBusinessActivityOther: sourceTemplateData.insuredBusinessActivityOther || targetTemplateData.insuredBusinessActivityOther,
      isOfferIndication: sourceTemplateData.isOfferIndication || targetTemplateData.isOfferIndication,

      tableType: sourceTemplateData.tableType || targetTemplateData.tableType,

      // WC Coverage
      wcCoverAddOnCovers: sourceTemplateData.wcCoverAddOnCovers.map((sourceItem, index) => ({
        ...(targetTemplateData.wcCoverAddOnCovers[index] || {}),
        ...sourceItem
      })),

      // Medical Benefits
      medicalBenifits: sourceTemplateData.medicalBenifits || targetTemplateData.medicalBenifits,
      medicalBenifitsAns: sourceTemplateData.medicalBenifitsAns || targetTemplateData.medicalBenifitsAns,
      medicalBenifitsAmount: sourceTemplateData.medicalBenifitsAmount || targetTemplateData.medicalBenifitsAmount,
      medicalBenifitsAmountId: sourceTemplateData.medicalBenifitsAmountId || targetTemplateData.medicalBenifitsAmountId,
      allmedicalBenifitsYesNo: sourceTemplateData.allmedicalBenifitsYesNo || targetTemplateData.allmedicalBenifitsYesNo,
      medicalBenifitsOption: sourceTemplateData.medicalBenifitsOption || targetTemplateData.medicalBenifitsOption,

      // Premium Details
      targetPremium: sourceTemplateData.targetPremium || targetTemplateData.targetPremium,
      adjustedPremium: sourceTemplateData.adjustedPremium || targetTemplateData.adjustedPremium,
      indicativePremium: sourceTemplateData.indicativePremium || targetTemplateData.indicativePremium,
      discountbasedonPremium: sourceTemplateData.discountbasedonPremium || targetTemplateData.discountbasedonPremium,
      addonCoversAmount: sourceTemplateData.addonCoversAmount || targetTemplateData.addonCoversAmount,
      totalPremiumAmt: sourceTemplateData.totalPremiumAmt || targetTemplateData.totalPremiumAmt,

      // Territory and Jurisdiction
      juridiction: sourceTemplateData.juridiction || targetTemplateData.juridiction,
      territory: sourceTemplateData.territory || targetTemplateData.territory,

      // Underwriter Details
      underWriteradjustedPremium: sourceTemplateData.underWriteradjustedPremium || targetTemplateData.underWriteradjustedPremium,
      underWritertargetPremium: sourceTemplateData.underWritertargetPremium || targetTemplateData.underWritertargetPremium,
      underWriterindicativePremium: sourceTemplateData.underWriterindicativePremium || targetTemplateData.underWriterindicativePremium,
      underWriterdiscountbasedonPremium: sourceTemplateData.underWriterdiscountbasedonPremium || targetTemplateData.underWriterdiscountbasedonPremium,
      underWriteraddonCoversAmount: sourceTemplateData.underWriteraddonCoversAmount || targetTemplateData.underWriteraddonCoversAmount,
      underWritertotalPremiumAmt: sourceTemplateData.underWritertotalPremiumAmt || targetTemplateData.underWritertotalPremiumAmt,
      underWritermedicalBenifitsAmount: sourceTemplateData.underWritermedicalBenifitsAmount || targetTemplateData.underWritermedicalBenifitsAmount,
      underWritermedicalBenifitsAmountId: sourceTemplateData.underWritermedicalBenifitsAmountId || targetTemplateData.underWritermedicalBenifitsAmountId,
      underWritermedicalBenifitsOption: sourceTemplateData.underWritermedicalBenifitsOption || targetTemplateData.underWritermedicalBenifitsOption,
      underWriterisActual: sourceTemplateData.underWriterisActual || targetTemplateData.underWriterisActual,

      // Safety and WC Details
      safetyMeasures: sourceTemplateData.safetyMeasures || targetTemplateData.safetyMeasures,
      wcDetails: sourceTemplateData.wcDetails.map((sourceItem, index) => ({
        ...(targetTemplateData.wcDetails[index] || {}),
        ...sourceItem
      })),
      isActual: sourceTemplateData.isActual || targetTemplateData.isActual,

      // Previous Policy Details
      previousCompany: sourceTemplateData.previousCompany || targetTemplateData.previousCompany,
      previousPolicyno: sourceTemplateData.previousPolicyno || targetTemplateData.previousPolicyno,
      previousStartdate: sourceTemplateData.previousStartdate || targetTemplateData.previousStartdate,
      previousEnddate: sourceTemplateData.previousEnddate || targetTemplateData.previousEnddate,

      // Attachments and Deductibles
      basicDetailsAttchments: [
        // Merge attachments from the source
        ...sourceTemplateData.basicDetailsAttchments.filter((sourceAttachment) => {
          // Include source attachment if no matching target attachment exists
          return !targetTemplateData.basicDetailsAttchments.some(
            (targetAttachment) =>
              targetAttachment.id === sourceAttachment.id ||
              (targetAttachment.attachmentType === sourceAttachment.attachmentType &&
                targetAttachment.fileName === sourceAttachment.fileName)
          );
        }),

        // Add target attachments not in the source
        ...targetTemplateData.basicDetailsAttchments.filter((targetAttachment) => {
          // Include target attachment if no matching source attachment exists
          return !sourceTemplateData.basicDetailsAttchments.some(
            (sourceAttachment) =>
              sourceAttachment.id === targetAttachment.id ||
              (sourceAttachment.attachmentType === targetAttachment.attachmentType &&
                sourceAttachment.fileName === targetAttachment.fileName)
          );
        }),

        // Include common attachments (based on matching `id`, `attachmentType`, `fileName`)
        ...sourceTemplateData.basicDetailsAttchments.filter((sourceAttachment) => {
          return targetTemplateData.basicDetailsAttchments.some(
            (targetAttachment) =>
              targetAttachment.id === sourceAttachment.id &&
              targetAttachment.attachmentType === sourceAttachment.attachmentType &&
              targetAttachment.fileName === sourceAttachment.fileName
          );
        })
      ],

      // Deductibles
      liabiltyDeductibles: [
        ...sourceTemplateData.liabiltyDeductibles.map((sourceDeductible) => {
          const targetDeductible = targetTemplateData.liabiltyDeductibles.find(
            (targetDeductible) => targetDeductible.description === sourceDeductible.description
          );

          // Merge logic
          if (!targetDeductible || targetDeductible.amount !== sourceDeductible.amount) {
            return {
              description: sourceDeductible.description,
              amount: sourceDeductible.amount,
            };
          }
          return targetDeductible; // Keep the target's deductible if they match
        }),
        // Add target deductibles not in the source
        ...targetTemplateData.liabiltyDeductibles.filter(
          (targetDeductible) =>
            !sourceTemplateData.liabiltyDeductibles.some(
              (sourceDeductible) => sourceDeductible.description === targetDeductible.description
            )
        ),
      ],

      // Option Related Fields
      isOptionSelected: sourceTemplateData.isOptionSelected || targetTemplateData.isOptionSelected,
      selectedFromOptionNo: sourceTemplateData.selectedFromOptionNo || targetTemplateData.selectedFromOptionNo,
      options: sourceTemplateData.options || targetTemplateData.options,
      isAccepted: sourceTemplateData.isAccepted || targetTemplateData.isAccepted,
      isQuoteOptionPlaced: sourceTemplateData.isQuoteOptionPlaced || targetTemplateData.isQuoteOptionPlaced,

      // Liability Covers
      liabiltyCovers: sourceTemplateData.liabiltyCovers.map((sourceCover, index) => {
        const targetCover = targetTemplateData.liabiltyCovers?.[index] || {};
        const mergedOptionSelected = sourceCover.optionSelected || targetCover.optionSelected;
        const mergeDescription = sourceCover.description || targetCover.description;
        return {
          ...targetCover,
          ...sourceCover,
          description: mergeDescription,
          optionSelected: mergedOptionSelected, // Ensure optionSelected is merged
          isSelected: !!mergedOptionSelected, // Mark isSelected true if optionSelected has a value
        };
      }),

      // Version and Reference Details
      version: sourceTemplateData.version || targetTemplateData.version,
      referenceNo: sourceTemplateData.referenceNo || targetTemplateData.referenceNo,
      chequeNo: sourceTemplateData.chequeNo || targetTemplateData.chequeNo,
      bankName: sourceTemplateData.bankName || targetTemplateData.bankName,
      paymentDate: sourceTemplateData.paymentDate || targetTemplateData.paymentDate,
      paymentAmount: sourceTemplateData.paymentAmount || targetTemplateData.paymentAmount,

      // Premium Details Object
      premiumDetails: {
        ...(targetTemplateData.premiumDetails || {}),
        ...(sourceTemplateData.premiumDetails || {})
      },

      // Co-insurers
      coInsurers: sourceTemplateData.coInsurers.map((sourceItem, index) => ({
        ...(targetTemplateData.coInsurers[index] || {}),
        ...sourceItem
      })),

      // Explicitly excluded fields
      _id: undefined,
      optionName: undefined,
      optionIndex: undefined
    };
  }

  mergeEandOTemplate(
    sourceTemplateData: any,
    targetTemplateData: any
  ): any {
    return {
      // Basic Details
      quoteId: sourceTemplateData.quoteId || targetTemplateData.quoteId,

      insuredBusinessActivityId: sourceTemplateData.insuredBusinessActivityId || targetTemplateData.insuredBusinessActivityId,
      insuredBusinessActivityOther: sourceTemplateData.insuredBusinessActivityOther || targetTemplateData.insuredBusinessActivityOther,
      limitOfLiability: sourceTemplateData.limitOfLiability || targetTemplateData.limitOfLiability,
      isOfferIndication: sourceTemplateData.isOfferIndication || targetTemplateData.isOfferIndication,

      detailsOfBusinessActivity: sourceTemplateData.detailsOfBusinessActivity || targetTemplateData.detailsOfBusinessActivity,
      typeOfPolicy: sourceTemplateData.typeOfPolicy || targetTemplateData.typeOfPolicy,
      numberOfExperienceId: sourceTemplateData.numberOfExperienceId || targetTemplateData.numberOfExperienceId,
      retroactiveCoverId: sourceTemplateData.retroactiveCoverId || targetTemplateData.retroactiveCoverId,
      retroactiveDate: sourceTemplateData.retroactiveDate || targetTemplateData.retroactiveDate,
      totalPremiumAmt: sourceTemplateData.totalPremiumAmt || targetTemplateData.totalPremiumAmt,
      additionalInformation: sourceTemplateData.additionalInformation || targetTemplateData.additionalInformation,

      // Territory and Jurisdiction
      juridictionId: sourceTemplateData.juridictionId || targetTemplateData.juridictionId,
      territoryId: sourceTemplateData.territoryId || targetTemplateData.territoryId,

      // Subsidiary Details
      subsidairyAnnualReportFilePath: sourceTemplateData.subsidairyAnnualReportFilePath || targetTemplateData.subsidairyAnnualReportFilePath,
      subsidaryDetails: [
        ...sourceTemplateData.subsidaryDetails.flatMap((sourceItem) => {
          const targetItem = targetTemplateData.subsidaryDetails.find(
            (targetItem) => targetItem.countryId === sourceItem.countryId
          );
          if (!targetItem) {
            return [sourceItem];
          }
          if (sourceItem.isSelected !== targetItem.isSelected) {
            return [
              { ...targetItem }, // Include target item as is
              { ...sourceItem }, // Include source item as is
            ];
          }
          return [
            {
              countryId: sourceItem.countryId,
              countryName: sourceItem.countryName || targetItem.countryName || '',
              isSelected: sourceItem.isSelected || targetItem.isSelected,
              activityName: sourceItem.activityName || targetItem.activityName || '',
            },
          ];
        }),
        ...targetTemplateData.subsidaryDetails.filter(
          (targetItem) =>
            !sourceTemplateData.subsidaryDetails.some(
              (sourceItem) => sourceItem.countryId === targetItem.countryId
            )
        ),
      ],

      // Option Related Fields
      isOptionSelected: sourceTemplateData.isOptionSelected || targetTemplateData.isOptionSelected,
      selectedFromOptionNo: sourceTemplateData.selectedFromOptionNo || targetTemplateData.selectedFromOptionNo,
      options: sourceTemplateData.options || targetTemplateData.options,
      isAccepted: sourceTemplateData.isAccepted || targetTemplateData.isAccepted,
      isQuoteOptionPlaced: sourceTemplateData.isQuoteOptionPlaced || targetTemplateData.isQuoteOptionPlaced,

      // Revenue Details
      revenueDetails: {
        revenueColumn: sourceTemplateData.revenueDetails?.revenueColumn.map((sourceColumn) => {
          const targetColumn = targetTemplateData.revenueDetails?.revenueColumn.find(
            (col) => col.value === sourceColumn.value
          );
          return {
            value: sourceColumn.value,
            label: sourceColumn.label || targetColumn?.label || '',
          };
        }),
        revenueRows: sourceTemplateData.revenueDetails?.revenueRows.map((sourceRow) => {
          const targetRow = targetTemplateData.revenueDetails?.revenueRows.find(
            (row) => row.name === sourceRow.name
          );
          return {
            label: sourceRow.label || targetRow?.label || '',
            name: sourceRow.name,
            firstYear: sourceRow.firstYear || targetRow?.firstYear || 0,
            secondYear: sourceRow.secondYear || targetRow?.secondYear || 0,
            thirdYear: sourceRow.thirdYear || targetRow?.thirdYear || 0,
            fourthYear: sourceRow.fourthYear || targetRow?.fourthYear || 0,
            fifthYear: sourceRow.fifthYear || targetRow?.fifthYear || 0,
            EstForNextYear: sourceRow.EstForNextYear || targetRow?.EstForNextYear || 0,
          };
        }).concat(
          targetTemplateData.revenueDetails?.revenueRows.filter(
            (targetRow) =>
              !sourceTemplateData.revenueDetails?.revenueRows.some(
                (sourceRow) => sourceRow.name === targetRow.name
              )
          ) || []
        ),
      },

      // Deductibles and Covers
      // Deductibles
      // Deductibles
      liabiltyDeductibles: [
        ...sourceTemplateData.liabiltyDeductibles.map((sourceDeductible) => {
          const targetDeductible = targetTemplateData.liabiltyDeductibles.find(
            (targetDeductible) => targetDeductible.description === sourceDeductible.description
          );

          // Merge logic
          if (!targetDeductible || targetDeductible.amount !== sourceDeductible.amount) {
            return {
              description: sourceDeductible.description,
              amount: sourceDeductible.amount,
            };
          }
          return targetDeductible; // Keep the target's deductible if they match
        }),
        // Add target deductibles not in the source
        ...targetTemplateData.liabiltyDeductibles.filter(
          (targetDeductible) =>
            !sourceTemplateData.liabiltyDeductibles.some(
              (sourceDeductible) => sourceDeductible.description === targetDeductible.description
            )
        ),
      ],

      liabiltyCovers: sourceTemplateData.liabiltyCovers.map((sourceCover, index) => {
        const targetCover = targetTemplateData.liabiltyCovers?.[index] || {};
        const mergedOptionSelected = sourceCover.optionSelected || targetCover.optionSelected;
        const mergeDescription = sourceCover.description || targetCover.description;
        return {
          ...targetCover,
          ...sourceCover,
          description: mergeDescription,
          optionSelected: mergedOptionSelected, // Ensure optionSelected is merged
          isSelected: !!mergedOptionSelected, // Mark isSelected true if optionSelected has a value
        };
      }),

      // Attachments
      basicDetailsAttchments: [
        // Merge attachments from the source
        ...sourceTemplateData.basicDetailsAttchments.filter((sourceAttachment) => {
          // Include source attachment if no matching target attachment exists
          return !targetTemplateData.basicDetailsAttchments.some(
            (targetAttachment) =>
              targetAttachment.id === sourceAttachment.id ||
              (targetAttachment.attachmentType === sourceAttachment.attachmentType &&
                targetAttachment.fileName === sourceAttachment.fileName)
          );
        }),

        // Add target attachments not in the source
        ...targetTemplateData.basicDetailsAttchments.filter((targetAttachment) => {
          // Include target attachment if no matching source attachment exists
          return !sourceTemplateData.basicDetailsAttchments.some(
            (sourceAttachment) =>
              sourceAttachment.id === targetAttachment.id ||
              (sourceAttachment.attachmentType === targetAttachment.attachmentType &&
                sourceAttachment.fileName === targetAttachment.fileName)
          );
        }),

        // Include common attachments (based on matching `id`, `attachmentType`, `fileName`)
        ...sourceTemplateData.basicDetailsAttchments.filter((sourceAttachment) => {
          return targetTemplateData.basicDetailsAttchments.some(
            (targetAttachment) =>
              targetAttachment.id === sourceAttachment.id &&
              targetAttachment.attachmentType === sourceAttachment.attachmentType &&
              targetAttachment.fileName === sourceAttachment.fileName
          );
        })
      ],
      // Additional Fields
      isBreakupRevenueORTurnover: sourceTemplateData.isBreakupRevenueORTurnover || targetTemplateData.isBreakupRevenueORTurnover,
      version: sourceTemplateData.version || targetTemplateData.version,
      referenceNo: sourceTemplateData.referenceNo || targetTemplateData.referenceNo,
      chequeNo: sourceTemplateData.chequeNo || targetTemplateData.chequeNo,
      bankName: sourceTemplateData.bankName || targetTemplateData.bankName,
      paymentDate: sourceTemplateData.paymentDate || targetTemplateData.paymentDate,
      paymentAmount: sourceTemplateData.paymentAmount || targetTemplateData.paymentAmount,

      // Premium Details
      premiumDetails: {
        ...(targetTemplateData.premiumDetails || {}),
        ...(sourceTemplateData.premiumDetails || {})
      },

      // Co-insurers
      coInsurers: sourceTemplateData.coInsurers.map((sourceItem, index) => ({
        ...(targetTemplateData.coInsurers[index] || {}),
        ...sourceItem
      })),

      // Explicitly excluded fields
      _id: undefined,
      optionName: undefined,
      optionIndex: undefined
    };
  }

  mergeProductLiabilityTemplate(
    sourceTemplateData: any,
    targetTemplateData: any
  ): any {
    return {
      // Base properties
      quoteId: sourceTemplateData.quoteId || targetTemplateData.quoteId,
      insuredBusinessActivityId: sourceTemplateData.insuredBusinessActivityId || targetTemplateData.insuredBusinessActivityId,
      insuredBusinessActivityOther: sourceTemplateData.insuredBusinessActivityOther || targetTemplateData.insuredBusinessActivityOther,
      limitOfLiability: sourceTemplateData.limitOfLiability || targetTemplateData.limitOfLiability,
      isOfferIndication: sourceTemplateData.isOfferIndication || targetTemplateData.isOfferIndication,

      detailsOfBusinessActivity: sourceTemplateData.detailsOfBusinessActivity || targetTemplateData.detailsOfBusinessActivity,
      typeOfPolicyId: sourceTemplateData.typeOfPolicyId || targetTemplateData.typeOfPolicyId,
      numberOfExperienceId: sourceTemplateData.numberOfExperienceId || targetTemplateData.numberOfExperienceId,
      retroactiveCoverId: sourceTemplateData.retroactiveCoverId || targetTemplateData.retroactiveCoverId,
      detailsOfProductAndUsage: sourceTemplateData.detailsOfProductAndUsage || targetTemplateData.detailsOfProductAndUsage,
      retroactiveDate: sourceTemplateData.retroactiveDate || targetTemplateData.retroactiveDate,
      totalPremiumAmt: sourceTemplateData.totalPremiumAmt || targetTemplateData.totalPremiumAmt,

      // Territory and jurisdiction details
      juridictionId: sourceTemplateData.juridictionId || targetTemplateData.juridictionId,
      territoryId: sourceTemplateData.territoryId || targetTemplateData.territoryId,
      juridiction: sourceTemplateData.juridiction || targetTemplateData.juridiction,
      territory: sourceTemplateData.territory || targetTemplateData.territory,

      // Subsidiary details
      subsidaryDetails: [
        ...sourceTemplateData.subsidaryDetails.flatMap((sourceItem) => {
          const targetItem = targetTemplateData.subsidaryDetails.find(
            (targetItem) => targetItem.countryId === sourceItem.countryId
          );
          if (!targetItem) {
            return [sourceItem];
          }
          if (sourceItem.isSelected !== targetItem.isSelected) {
            return [
              { ...targetItem }, // Include target item as is
              { ...sourceItem }, // Include source item as is
            ];
          }
          return [
            {
              countryId: sourceItem.countryId,
              countryName: sourceItem.countryName || targetItem.countryName || '',
              isSelected: sourceItem.isSelected || targetItem.isSelected,
              activityName: sourceItem.activityName || targetItem.activityName || '',
            },
          ];
        }),
        ...targetTemplateData.subsidaryDetails.filter(
          (targetItem) =>
            !sourceTemplateData.subsidaryDetails.some(
              (sourceItem) => sourceItem.countryId === targetItem.countryId
            )
        ),
      ],

      // Turn Over Details
      turnOverDetails: {
        revenueColumn: sourceTemplateData.turnOverDetails?.revenueColumn.map((sourceColumn) => {
          const targetColumn = targetTemplateData.turnOverDetails?.revenueColumn.find(
            (col) => col.value === sourceColumn.value
          );
          return {
            value: sourceColumn.value,
            label: sourceColumn.label || targetColumn?.label || '',
          };
        }),
        revenueRows: sourceTemplateData.turnOverDetails?.revenueRows.map((sourceRow) => {
          const targetRow = targetTemplateData.turnOverDetails?.revenueRows.find(
            (row) => row.name === sourceRow.name
          );
          return {
            label: sourceRow.label || targetRow?.label || '',
            name: sourceRow.name,
            firstYear: sourceRow.firstYear || targetRow?.firstYear || 0,
            secondYear: sourceRow.secondYear || targetRow?.secondYear || 0,
            thirdYear: sourceRow.thirdYear || targetRow?.thirdYear || 0,
            fourthYear: sourceRow.fourthYear || targetRow?.fourthYear || 0,
            fifthYear: sourceRow.fifthYear || targetRow?.fifthYear || 0,
            EstForNextYear: sourceRow.EstForNextYear || targetRow?.EstForNextYear || 0,
          };
        }).concat(
          targetTemplateData.turnOverDetails?.revenueRows.filter(
            (targetRow) =>
              !sourceTemplateData.turnOverDetails?.revenueRows.some(
                (sourceRow) => sourceRow.name === targetRow.name
              )
          ) || []
        ),
      },

      // Liability covers
      liabiltyCovers: sourceTemplateData.liabiltyCovers.map((sourceCover, index) => {
        const targetCover = targetTemplateData.liabiltyCovers?.[index] || {};
        const mergedOptionSelected = sourceCover.optionSelected || targetCover.optionSelected;
        const mergeDescription = sourceCover.description || targetCover.description;
        return {
          ...targetCover,
          ...sourceCover,
          description: mergeDescription,
          optionSelected: mergedOptionSelected, // Ensure optionSelected is merged
          isSelected: !!mergedOptionSelected, // Mark isSelected true if optionSelected has a value
        };
      }),

      // Basic details attachments
      basicDetailsAttchments: [
        // Merge attachments from the source
        ...sourceTemplateData.basicDetailsAttchments.filter((sourceAttachment) => {
          // Include source attachment if no matching target attachment exists
          return !targetTemplateData.basicDetailsAttchments.some(
            (targetAttachment) =>
              targetAttachment.id === sourceAttachment.id ||
              (targetAttachment.attachmentType === sourceAttachment.attachmentType &&
                targetAttachment.fileName === sourceAttachment.fileName)
          );
        }),

        // Add target attachments not in the source
        ...targetTemplateData.basicDetailsAttchments.filter((targetAttachment) => {
          // Include target attachment if no matching source attachment exists
          return !sourceTemplateData.basicDetailsAttchments.some(
            (sourceAttachment) =>
              sourceAttachment.id === targetAttachment.id ||
              (sourceAttachment.attachmentType === targetAttachment.attachmentType &&
                sourceAttachment.fileName === targetAttachment.fileName)
          );
        }),

        // Include common attachments (based on matching `id`, `attachmentType`, `fileName`)
        ...sourceTemplateData.basicDetailsAttchments.filter((sourceAttachment) => {
          return targetTemplateData.basicDetailsAttchments.some(
            (targetAttachment) =>
              targetAttachment.id === sourceAttachment.id &&
              targetAttachment.attachmentType === sourceAttachment.attachmentType &&
              targetAttachment.fileName === sourceAttachment.fileName
          );
        })
      ],

      // Deductibles
      liabiltyDeductibles: [
        ...sourceTemplateData.liabiltyDeductibles.map((sourceDeductible) => {
          const targetDeductible = targetTemplateData.liabiltyDeductibles.find(
            (targetDeductible) => targetDeductible.description === sourceDeductible.description
          );

          // Merge logic
          if (!targetDeductible || targetDeductible.amount !== sourceDeductible.amount) {
            return {
              description: sourceDeductible.description,
              amount: sourceDeductible.amount,
            };
          }
          return targetDeductible; // Keep the target's deductible if they match
        }),
        // Add target deductibles not in the source
        ...targetTemplateData.liabiltyDeductibles.filter(
          (targetDeductible) =>
            !sourceTemplateData.liabiltyDeductibles.some(
              (sourceDeductible) => sourceDeductible.description === targetDeductible.description
            )
        ),
      ],


      // Additional information
      additionalInformation: sourceTemplateData.additionalInformation || targetTemplateData.additionalInformation,
      // Option related fields
      isBreakupRevenueORTurnover: sourceTemplateData.isBreakupRevenueORTurnover || targetTemplateData.isBreakupRevenueORTurnover,
      isOptionSelected: sourceTemplateData.isOptionSelected || targetTemplateData.isOptionSelected,
      selectedFromOptionNo: sourceTemplateData.selectedFromOptionNo || targetTemplateData.selectedFromOptionNo,
      options: sourceTemplateData.options || targetTemplateData.options,
      isAccepted: sourceTemplateData.isAccepted || targetTemplateData.isAccepted,
      isQuoteOptionPlaced: sourceTemplateData.isQuoteOptionPlaced || targetTemplateData.isQuoteOptionPlaced,

      // Version and reference details
      version: sourceTemplateData.version || targetTemplateData.version,
      referenceNo: sourceTemplateData.referenceNo || targetTemplateData.referenceNo,
      chequeNo: sourceTemplateData.chequeNo || targetTemplateData.chequeNo,
      bankName: sourceTemplateData.bankName || targetTemplateData.bankName,
      paymentDate: sourceTemplateData.paymentDate || targetTemplateData.paymentDate,
      paymentAmount: sourceTemplateData.paymentAmount || targetTemplateData.paymentAmount,

      // Premium details
      premiumDetails: {
        ...(targetTemplateData.premiumDetails || {}),
        ...(sourceTemplateData.premiumDetails || {})
      },

      // Co-insurers
      coInsurers: sourceTemplateData.coInsurers.map((sourceItem, index) => ({
        ...(targetTemplateData.coInsurers[index] || {}),
        ...sourceItem
      })),

      // Explicitly excluded fields
      _id: undefined,
      optionName: undefined,
      optionIndex: undefined
    };
  }

  mergeLiabilityTemplateData(
    sourceTemplateData: any,
    targetTemplateData: any
  ): any {
    return {
      ...targetTemplateData, // Base layer with target data
      ...sourceTemplateData, // Override with source data
      _id: undefined, // Explicitly exclude _id
      optionName: undefined, // Explicitly exclude optionName  
      optionIndex: undefined, // Explicitly exclude optionIndex
      employeesDetails: sourceTemplateData.employeesDetails.map((sourceEmployee, index) => ({
        ...(targetTemplateData.employeesDetails?.[index] || {}),
        ...sourceEmployee
      })),
      subsidaryDetails: [
        ...sourceTemplateData.subsidaryDetails.flatMap((sourceItem) => {
          const targetItem = targetTemplateData.subsidaryDetails.find(
            (targetItem) => targetItem.countryId === sourceItem.countryId
          );
          if (!targetItem) {
            return [sourceItem];
          }
          if (sourceItem.isSelected !== targetItem.isSelected) {
            return [
              { ...targetItem }, // Include target item as is
              { ...sourceItem }, // Include source item as is
            ];
          }
          return [
            {
              countryId: sourceItem.countryId,
              countryName: sourceItem.countryName || targetItem.countryName || '',
              isSelected: sourceItem.isSelected || targetItem.isSelected,
              activityName: sourceItem.activityName || targetItem.activityName || '',
            },
          ];
        }),
        ...targetTemplateData.subsidaryDetails.filter(
          (targetItem) =>
            !sourceTemplateData.subsidaryDetails.some(
              (sourceItem) => sourceItem.countryId === targetItem.countryId
            )
        ),
      ],

      basicDetailsAttchments: [
        // Merge attachments from the source
        ...sourceTemplateData.basicDetailsAttchments.filter((sourceAttachment) => {
          // Include source attachment if no matching target attachment exists
          return !targetTemplateData.basicDetailsAttchments.some(
            (targetAttachment) =>
              targetAttachment.id === sourceAttachment.id ||
              (targetAttachment.attachmentType === sourceAttachment.attachmentType &&
                targetAttachment.fileName === sourceAttachment.fileName)
          );
        }),

        // Add target attachments not in the source
        ...targetTemplateData.basicDetailsAttchments.filter((targetAttachment) => {
          // Include target attachment if no matching source attachment exists
          return !sourceTemplateData.basicDetailsAttchments.some(
            (sourceAttachment) =>
              sourceAttachment.id === targetAttachment.id ||
              (sourceAttachment.attachmentType === targetAttachment.attachmentType &&
                sourceAttachment.fileName === targetAttachment.fileName)
          );
        }),

        // Include common attachments (based on matching `id`, `attachmentType`, `fileName`)
        ...sourceTemplateData.basicDetailsAttchments.filter((sourceAttachment) => {
          return targetTemplateData.basicDetailsAttchments.some(
            (targetAttachment) =>
              targetAttachment.id === sourceAttachment.id &&
              targetAttachment.attachmentType === sourceAttachment.attachmentType &&
              targetAttachment.fileName === sourceAttachment.fileName
          );
        })
      ],



      liabiltyCovers: sourceTemplateData.liabiltyCovers.map((sourceCover, index) => {
        const targetCover = targetTemplateData.liabiltyCovers?.[index] || {};
        const mergedOptionSelected = sourceCover.optionSelected || targetCover.optionSelected;
        const mergeDescription = sourceCover.description || targetCover.description;
        return {
          ...targetCover,
          ...sourceCover,
          description: mergeDescription,
          optionSelected: mergedOptionSelected, // Ensure optionSelected is merged
          isSelected: !!mergedOptionSelected, // Mark isSelected true if optionSelected has a value
        };
      }),
      // Deductibles
      liabiltyDeductibles: [
        ...sourceTemplateData.liabiltyDeductibles.map((sourceDeductible) => {
          const targetDeductible = targetTemplateData.liabiltyDeductibles.find(
            (targetDeductible) => targetDeductible.description === sourceDeductible.description
          );

          // Merge logic
          if (!targetDeductible || targetDeductible.amount !== sourceDeductible.amount) {
            return {
              description: sourceDeductible.description,
              amount: sourceDeductible.amount,
            };
          }
          return targetDeductible; // Keep the target's deductible if they match
        }),
        // Add target deductibles not in the source
        ...targetTemplateData.liabiltyDeductibles.filter(
          (targetDeductible) =>
            !sourceTemplateData.liabiltyDeductibles.some(
              (sourceDeductible) => sourceDeductible.description === targetDeductible.description
            )
        ),
      ],

      revenueDetails: {
        revenueColumn: sourceTemplateData.revenueDetails?.revenueColumn.map((sourceColumn) => {
          const targetColumn = targetTemplateData.revenueDetails?.revenueColumn.find(
            (col) => col.value === sourceColumn.value
          );
          return {
            value: sourceColumn.value,
            label: sourceColumn.label || targetColumn?.label || '',
          };
        }),
        revenueRows: sourceTemplateData.revenueDetails?.revenueRows.map((sourceRow) => {
          const targetRow = targetTemplateData.revenueDetails?.revenueRows.find(
            (row) => row.name === sourceRow.name
          );
          return {
            label: sourceRow.label || targetRow?.label || '',
            name: sourceRow.name,
            firstYear: sourceRow.firstYear || targetRow?.firstYear || 0,
            secondYear: sourceRow.secondYear || targetRow?.secondYear || 0,
            thirdYear: sourceRow.thirdYear || targetRow?.thirdYear || 0,
            fourthYear: sourceRow.fourthYear || targetRow?.fourthYear || 0,
            fifthYear: sourceRow.fifthYear || targetRow?.fifthYear || 0,
            EstForNextYear: sourceRow.EstForNextYear || targetRow?.EstForNextYear || 0,
          };
        }).concat(
          targetTemplateData.revenueDetails?.revenueRows.filter(
            (targetRow) =>
              !sourceTemplateData.revenueDetails?.revenueRows.some(
                (sourceRow) => sourceRow.name === targetRow.name
              )
          ) || []
        ),
      },
      premiumDetails: {
        ...(targetTemplateData.premiumDetails || {}),
        ...(sourceTemplateData.premiumDetails || {})
      },
      coInsurers: sourceTemplateData.coInsurers.map((sourceCoInsurer, index) => ({
        ...(targetTemplateData.coInsurers?.[index] || {}),
        ...sourceCoInsurer
      })),
      // For simple fields, prioritize source over target
      totalPremiumAmt: sourceTemplateData.totalPremiumAmt || targetTemplateData.totalPremiumAmt,
      additionalInformation: sourceTemplateData.additionalInformation || targetTemplateData.additionalInformation,
      typeOfPolicyId: sourceTemplateData.typeOfPolicyId || targetTemplateData.typeOfPolicyId,
      natureOfBusinessId: sourceTemplateData.natureOfBusinessId || targetTemplateData.natureOfBusinessId,
      retroactiveCoverId: sourceTemplateData.retroactiveCoverId || targetTemplateData.retroactiveCoverId,
      aoaAoyId: sourceTemplateData.aoaAoyId || targetTemplateData.aoaAoyId,
      anyOneAccident: sourceTemplateData.anyOneAccident || targetTemplateData.anyOneAccident,
      inTheAggregate: sourceTemplateData.inTheAggregate || targetTemplateData.inTheAggregate,
      totalNumberOfEmployees: sourceTemplateData.totalNumberOfEmployees || targetTemplateData.totalNumberOfEmployees,
      isOptionSelected: sourceTemplateData.isOptionSelected || targetTemplateData.isOptionSelected,
      version: sourceTemplateData.version || targetTemplateData.version,
      referenceNo: sourceTemplateData.referenceNo || targetTemplateData.referenceNo,
      chequeNo: sourceTemplateData.chequeNo || targetTemplateData.chequeNo,
      bankName: sourceTemplateData.bankName || targetTemplateData.bankName,
      paymentDate: sourceTemplateData.paymentDate || targetTemplateData.paymentDate,
      paymentAmount: sourceTemplateData.paymentAmount || targetTemplateData.paymentAmount,
      insuredBusinessActivityId: sourceTemplateData.insuredBusinessActivityId || targetTemplateData.insuredBusinessActivityId,
      insuredBusinessActivityOther: sourceTemplateData.insuredBusinessActivityOther || targetTemplateData.insuredBusinessActivityOther,
      limitOfLiability: sourceTemplateData.limitOfLiability || targetTemplateData.limitOfLiability,
      isOfferIndication: sourceTemplateData.isOfferIndication || targetTemplateData.isOfferIndication,
    };
  }

  mergeLiabilityCGLTemplateData(
    sourceTemplateData: any,
    targetTemplateData: any
  ): any {
    return {
      // Base properties
      quoteId: sourceTemplateData.quoteId || targetTemplateData.quoteId,

      insuredBusinessActivityId: sourceTemplateData.insuredBusinessActivityId || targetTemplateData.insuredBusinessActivityId,
      insuredBusinessActivityOther: sourceTemplateData.insuredBusinessActivityOther || targetTemplateData.insuredBusinessActivityOther,
      limitOfLiability: sourceTemplateData.limitOfLiability || targetTemplateData.limitOfLiability,
      isOfferIndication: sourceTemplateData.isOfferIndication || targetTemplateData.isOfferIndication,
      typeOfProductId: sourceTemplateData.typeOfProductId || targetTemplateData.typeOfProductId,

      detailsOfBusinessActivity: sourceTemplateData.detailsOfBusinessActivity || targetTemplateData.detailsOfBusinessActivity,
      typeOfPolicyId: sourceTemplateData.typeOfPolicyId || targetTemplateData.typeOfPolicyId,
      typeOfPolicy: sourceTemplateData.typeOfPolicy || targetTemplateData.typeOfPolicy,
      detailsOfHazardousChemical: sourceTemplateData.detailsOfHazardousChemical || targetTemplateData.detailsOfHazardousChemical,
      aoaAoyId: sourceTemplateData.aoaAoyId || targetTemplateData.aoaAoyId,
      anyOneAccident: sourceTemplateData.anyOneAccident || targetTemplateData.anyOneAccident,
      inTheAggregate: sourceTemplateData.inTheAggregate || targetTemplateData.inTheAggregate,
      jurasdiction: sourceTemplateData.jurasdiction || targetTemplateData.jurasdiction,
      territory: sourceTemplateData.territory || targetTemplateData.territory,
      retroactiveCoverId: sourceTemplateData.retroactiveCoverId || targetTemplateData.retroactiveCoverId,
      detailsOfProductAndUsage: sourceTemplateData.detailsOfProductAndUsage || targetTemplateData.detailsOfProductAndUsage,
      retroactiveDate: sourceTemplateData.retroactiveDate || targetTemplateData.retroactiveDate,
      additionalInformation: sourceTemplateData.additionalInformation || targetTemplateData.additionalInformation,
      totalPremiumAmt: sourceTemplateData.totalPremiumAmt || targetTemplateData.totalPremiumAmt,

      // Territory and jurisdiction
      juridictionId: sourceTemplateData.juridictionId || targetTemplateData.juridictionId,
      territoryId: sourceTemplateData.territoryId || targetTemplateData.territoryId,

      // Arrays - map through and merge corresponding items
      subsidaryDetails: [
        ...sourceTemplateData.subsidaryDetails.flatMap((sourceItem) => {
          const targetItem = targetTemplateData.subsidaryDetails.find(
            (targetItem) => targetItem.countryId === sourceItem.countryId
          );
          if (!targetItem) {
            return [sourceItem];
          }
          if (sourceItem.isSelected !== targetItem.isSelected) {
            return [
              { ...targetItem }, // Include target item as is
              { ...sourceItem }, // Include source item as is
            ];
          }
          return [
            {
              countryId: sourceItem.countryId,
              countryName: sourceItem.countryName || targetItem.countryName || '',
              isSelected: sourceItem.isSelected || targetItem.isSelected,
              activityName: sourceItem.activityName || targetItem.activityName || '',
            },
          ];
        }),
        ...targetTemplateData.subsidaryDetails.filter(
          (targetItem) =>
            !sourceTemplateData.subsidaryDetails.some(
              (sourceItem) => sourceItem.countryId === targetItem.countryId
            )
        ),
      ],

      // Turnover details - merge objects
      turnOverDetails: {
        revenueColumn: sourceTemplateData.turnOverDetails?.revenueColumn.map((sourceColumn) => {
          const targetColumn = targetTemplateData.turnOverDetails?.revenueColumn.find(
            (col) => col.value === sourceColumn.value
          );
          return {
            value: sourceColumn.value,
            label: sourceColumn.label || targetColumn?.label || '',
          };
        }),
        revenueRows: sourceTemplateData.turnOverDetails?.revenueRows.map((sourceRow) => {
          const targetRow = targetTemplateData.turnOverDetails?.revenueRows.find(
            (row) => row.name === sourceRow.name
          );
          return {
            label: sourceRow.label || targetRow?.label || '',
            name: sourceRow.name,
            firstYear: sourceRow.firstYear || targetRow?.firstYear || 0,
            secondYear: sourceRow.secondYear || targetRow?.secondYear || 0,
            thirdYear: sourceRow.thirdYear || targetRow?.thirdYear || 0,
            fourthYear: sourceRow.fourthYear || targetRow?.fourthYear || 0,
            fifthYear: sourceRow.fifthYear || targetRow?.fifthYear || 0,
            EstForNextYear: sourceRow.EstForNextYear || targetRow?.EstForNextYear || 0,
          };
        }).concat(
          targetTemplateData.turnOverDetails?.revenueRows.filter(
            (targetRow) =>
              !sourceTemplateData.turnOverDetails?.revenueRows.some(
                (sourceRow) => sourceRow.name === targetRow.name
              )
          ) || []
        ),
      },

      // Arrays with complex types
      liabiltyCovers: sourceTemplateData.liabiltyCovers.map((sourceCover, index) => {
        const targetCover = targetTemplateData.liabiltyCovers?.[index] || {};
        const mergedOptionSelected = sourceCover.optionSelected || targetCover.optionSelected;
        const mergeDescription = sourceCover.description || targetCover.description;
        return {
          ...targetCover,
          ...sourceCover,
          description: mergeDescription,
          optionSelected: mergedOptionSelected, // Ensure optionSelected is merged
          isSelected: !!mergedOptionSelected, // Mark isSelected true if optionSelected has a value
        };
      }),

      basicDetailsAttchments: [
        // Merge attachments from the source
        ...sourceTemplateData.basicDetailsAttchments.filter((sourceAttachment) => {
          // Include source attachment if no matching target attachment exists
          return !targetTemplateData.basicDetailsAttchments.some(
            (targetAttachment) =>
              targetAttachment.id === sourceAttachment.id ||
              (targetAttachment.attachmentType === sourceAttachment.attachmentType &&
                targetAttachment.fileName === sourceAttachment.fileName)
          );
        }),

        // Add target attachments not in the source
        ...targetTemplateData.basicDetailsAttchments.filter((targetAttachment) => {
          // Include target attachment if no matching source attachment exists
          return !sourceTemplateData.basicDetailsAttchments.some(
            (sourceAttachment) =>
              sourceAttachment.id === targetAttachment.id ||
              (sourceAttachment.attachmentType === targetAttachment.attachmentType &&
                sourceAttachment.fileName === targetAttachment.fileName)
          );
        }),

        // Include common attachments (based on matching `id`, `attachmentType`, `fileName`)
        ...sourceTemplateData.basicDetailsAttchments.filter((sourceAttachment) => {
          return targetTemplateData.basicDetailsAttchments.some(
            (targetAttachment) =>
              targetAttachment.id === sourceAttachment.id &&
              targetAttachment.attachmentType === sourceAttachment.attachmentType &&
              targetAttachment.fileName === sourceAttachment.fileName
          );
        })
      ],

      listOfLocations: [
        // Include all unique records from source
        ...sourceTemplateData.listOfLocations.filter((sourceLocation) => {
          return !targetTemplateData.listOfLocations.some(
            (targetLocation) => targetLocation.listofLocation === sourceLocation.listofLocation
          );
        }),

        // Include all unique records from target
        ...targetTemplateData.listOfLocations.filter((targetLocation) => {
          return !sourceTemplateData.listOfLocations.some(
            (sourceLocation) => sourceLocation.listofLocation === targetLocation.listofLocation
          );
        }),

        // Include common records where `listofLocation` matches
        ...sourceTemplateData.listOfLocations.filter((sourceLocation) => {
          return targetTemplateData.listOfLocations.some(
            (targetLocation) => targetLocation.listofLocation === sourceLocation.listofLocation
          );
        }),
      ],

      // Deductibles
      liabiltyDeductibles: [
        ...sourceTemplateData.liabiltyDeductibles.map((sourceDeductible) => {
          const targetDeductible = targetTemplateData.liabiltyDeductibles.find(
            (targetDeductible) => targetDeductible.description === sourceDeductible.description
          );

          // Merge logic
          if (!targetDeductible || targetDeductible.amount !== sourceDeductible.amount) {
            return {
              description: sourceDeductible.description,
              amount: sourceDeductible.amount,
            };
          }
          return targetDeductible; // Keep the target's deductible if they match
        }),
        // Add target deductibles not in the source
        ...targetTemplateData.liabiltyDeductibles.filter(
          (targetDeductible) =>
            !sourceTemplateData.liabiltyDeductibles.some(
              (sourceDeductible) => sourceDeductible.description === targetDeductible.description
            )
        ),
      ],

      coInsurers: sourceTemplateData.coInsurers.map((sourceItem, index) => ({
        ...(targetTemplateData.coInsurers[index] || {}),
        ...sourceItem
      })),

      // Simple fields - prioritize source over target
      isOptionSelected: sourceTemplateData.isOptionSelected || targetTemplateData.isOptionSelected,
      selectedFromOptionNo: sourceTemplateData.selectedFromOptionNo || targetTemplateData.selectedFromOptionNo,
      options: sourceTemplateData.options || targetTemplateData.options,
      isAccepted: sourceTemplateData.isAccepted || targetTemplateData.isAccepted,
      isQuoteOptionPlaced: sourceTemplateData.isQuoteOptionPlaced || targetTemplateData.isQuoteOptionPlaced,
      isBreakupRevenueORTurnover: sourceTemplateData.isBreakupRevenueORTurnover || targetTemplateData.isBreakupRevenueORTurnover,
      version: sourceTemplateData.version || targetTemplateData.version,
      referenceNo: sourceTemplateData.referenceNo || targetTemplateData.referenceNo,
      chequeNo: sourceTemplateData.chequeNo || targetTemplateData.chequeNo,
      bankName: sourceTemplateData.bankName || targetTemplateData.bankName,
      paymentDate: sourceTemplateData.paymentDate || targetTemplateData.paymentDate,
      paymentAmount: sourceTemplateData.paymentAmount || targetTemplateData.paymentAmount,

      // Premium details - merge objects
      premiumDetails: {
        ...(targetTemplateData.premiumDetails || {}),
        ...(sourceTemplateData.premiumDetails || {})
      },

      // Explicitly excluded fields
      _id: undefined,
      optionName: undefined,
      optionIndex: undefined
    };
  }


  mergeOptionsWithExpired() {
    if (!this.selectedMergeOption || !this.expiredOptionAvailable) return;

    // Find the expired option
    let expiredOption = this.quoteOptionsLst.find(opt => opt.isExpired);

    if (expiredOption) {
      // Create a new option as a clone of the selected option
      let newOption: any = {
        ...this.selectedMergeOption,
        _id: undefined,
        optionName: `Option ${this.quoteOptionsLst.length + 1}`,
        optionIndex: this.quoteOptionsLst.length + 1,
      };

      console.log(this.selectedMergeOption)
      console.log(expiredOption)

      switch (this.templateName) {
        case AllowedProductTemplate.LIABILITY:
        case AllowedProductTemplate.LIABILITY_CRIME:
          newOption = this.mergeLiabilityTemplateData(
            this.selectedMergeOption,
            expiredOption
          );
          break;
        case AllowedProductTemplate.LIABILITY_PRODUCT:
        case AllowedProductTemplate.LIABILITY_CYBER:
          newOption = this.mergeProductLiabilityTemplate(
            this.selectedMergeOption,
            expiredOption
          );
          break;
        case AllowedProductTemplate.LIABILITY_CGL:
        case AllowedProductTemplate.LIABILITY_PUBLIC:
          newOption = this.mergeLiabilityCGLTemplateData(
            this.selectedMergeOption,
            expiredOption
          );
          break;
        case AllowedProductTemplate.LIABILITY_EANDO:
          newOption = this.mergeEandOTemplate(
            this.selectedMergeOption,
            expiredOption
          );
          break;
        case AllowedProductTemplate.WORKMENSCOMPENSATION:
          newOption = this.mergeWCTemplate(
            this.selectedMergeOption,
            expiredOption
          );
          break;
        default:
          break;
      }

      newOption = {
        ...newOption,
        _id: undefined,
        optionName: `Option ${this.quoteOptionsLst.length + 1}`,
        optionIndex: this.quoteOptionsLst.length + 1,
        selectedFromOptionNo: "Expired Option and " + expiredOption.selectedFromOptionNo
      }

      this.isAdded = false;
      this.liabilityService.create(newOption).subscribe({
        next: quote => {
          this.isExpiryDisable = false;
          this.dialogRef.close();
          if (this.routeToDraft) this.routerService.navigateByUrl(`/backend/quotes/${this.quoteId}?quoteOptionId=${quote.data.entity._id}`)
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option Added Successfully`,
            life: 3000
          });
          this.getOptions();
          this.isAdded = !this.isAdded
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }


  onExpiredOptionChange(itemCover: any) {
    // Update each option's state
    this.quoteOptionsLst.forEach((item) => {
      if (item.optionName === "Expired") {
        // Rename the previously expired option back to its default name
        item.optionName = "Option " + item.optionIndex;
      }
    });

    this.quoteOptionsLst.forEach((item) => {
      // Mark the selected option as expired
      if (item.optionName === itemCover.optionName) {
        item.optionName = "Expired";
        item.isExpired = true;
      } else {
        item.isExpired = false;
      }
    });

    this.quoteOptionsLst.forEach(element => {
      if (itemCover._id != undefined) {
        this.liabilityService.update(element._id, element).subscribe({
          next: quote => {
            this.mergeOptions = this.quoteOptionsLst
              .filter(option => !option.isExpired) // Filter out expired options
              .map(option => ({
                label: option.optionName,
                value: option,
              }));

            //this.getOptions();

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


  getOptions() {
    this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<any[]>) => {
        this.quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion);
        // Prepare dropdown options for merging
        this.mergeOptions = this.quoteOptionsLst
          .filter(option => !option.isExpired) // Filter out expired options
          .map(option => ({
            label: option.optionName,
            value: option,
          }));
        this.expiredOptionAvailable = !!this.quoteOptionsLst.find(opt => opt.isExpired);
        if (this.quoteOptionsLst.length > 1) {
          this.isExpiryDisable = false;
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }
  addMoreOptions() {
    this.isExpiryDisable = true;
    if (this.templateName == AllowedProductTemplate.LIABILITY_EANDO) {
      this.quoteOptionsModel = new EandOTemplate();
    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY || this.templateName == AllowedProductTemplate.LIABILITY_CRIME) {
      this.quoteOptionsModel = new DANDOTemplate();
    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY_CGL || this.templateName == AllowedProductTemplate.LIABILITY_PUBLIC) {
      this.quoteOptionsModel = new CGLTemplate();
    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY_PRODUCT || this.templateName == AllowedProductTemplate.LIABILITY_CYBER) {
      this.quoteOptionsModel = new ProductLiabilityTemplate();
    }
    else if (this.templateName == AllowedProductTemplate.WORKMENSCOMPENSATION) {
      this.quoteOptionsModel = new WCTemplate();
    }
    this.quoteOptionsModel.optionName = "Option " + (+this.quoteOptionsLst.length + 1)
    this.quoteOptionsModel.optionIndex = (+this.quoteOptionsLst.length + 1)
    let OptionIndex = 1
    this.quoteOptionsLst.forEach(element => {
      this.quoteOptionsModel.options.push("Replicate Option as " + element.optionName)
      OptionIndex++;
    });
    this.quoteOptionsModel.selectedFromOptionNo = ""
    this.quoteOptionsLst.push(this.quoteOptionsModel);
  }

  checkIfIdExist() {

  }


  deleteOptions(optionModel: any, index: number) {
    // Remove the selected option from the list
    this.quoteOptionsLst.splice(index, 1);
    let deletedOption = optionModel.optionIndex;
    // Update the optionIndex and optionName for each remaining option
    this.quoteOptionsLst.forEach((itemCover, i) => {
      if (itemCover.optionName != "Expired") {
        itemCover.optionIndex = i + 1;
        itemCover.optionName = `Option ${i + 1}`;
      }
    });
    if (this.templateName == AllowedProductTemplate.LIABILITY_EANDO) {
      this.optionsServiceEandO.delete(optionModel._id).subscribe({
        next: quote => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option ${deletedOption} Deleted Successfully`,
            life: 3000
          });
          this.quoteOptionsLst.forEach(element => {
            this.optionsServiceEandO.update(element._id, element).subscribe({
              next: quote => {
                this.getOptions();
              }, error: error => {
                console.log(error);
              }
            });
          });
        }, error: error => {
          console.log(error);
        }
      });
    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY || this.templateName == AllowedProductTemplate.LIABILITY_CRIME) {
      this.optionsServiceDandOCrime.delete(optionModel._id).subscribe({
        next: quote => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option ${deletedOption} Deleted Successfully`,
            life: 3000
          });
          this.quoteOptionsLst.forEach(element => {
            this.optionsServiceDandOCrime.update(element._id, element).subscribe({
              next: quote => {
                this.getOptions();
              }, error: error => {
                console.log(error);
              }
            });
          });
        }, error: error => {
          console.log(error);
        }
      });

    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY_CGL || this.templateName == AllowedProductTemplate.LIABILITY_PUBLIC) {
      this.optionsServiceCGLPublic.delete(optionModel._id).subscribe({
        next: quote => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option ${deletedOption} Deleted Successfully`,
            life: 3000
          });
          this.quoteOptionsLst.forEach(element => {
            this.optionsServiceCGLPublic.update(element._id, element).subscribe({
              next: quote => {
                this.getOptions();
              }, error: error => {
                console.log(error);
              }
            });
          });
        }, error: error => {
          console.log(error);
        }
      });

    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY_PRODUCT || this.templateName == AllowedProductTemplate.LIABILITY_CYBER) {
      this.optionsServiceProductCyber.delete(optionModel._id).subscribe({
        next: quote => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option ${deletedOption} Deleted Successfully`,
            life: 3000
          });
          this.quoteOptionsLst.forEach(element => {
            this.optionsServiceProductCyber.update(element._id, element).subscribe({
              next: quote => {
                this.getOptions();
              }, error: error => {
                console.log(error);
              }
            });
          });
        }, error: error => {
          console.log(error);
        }
      });
    }
    else if (this.templateName == AllowedProductTemplate.WORKMENSCOMPENSATION) {
      this.optionsServiceWC.delete(optionModel._id).subscribe({
        next: quote => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option Deleted Successfully`,
            life: 3000
          });
          this.quoteOptionsLst.forEach(element => {
            this.optionsServiceWC.update(element._id, element).subscribe({
              next: quote => {
                this.getOptions();
              }, error: error => {
                console.log(error);
              }
            });
          });
        }, error: error => {
          console.log(error);
        }
      });
    }
  }

  OptionChanged(optionChanged: LiabilityCoveragesOptions, event: any) {
    if (event.checked) {
      optionChanged.selectedOption = optionChanged.options[0];
      //optionChanged.LiabilityTemplateData = this.quote.LiabilityTemplateDataId["LiabilityTemplateData"]
      console.log(optionChanged)
    }
    else {
      optionChanged.selectedOption = ""
      optionChanged.templateData = null
      console.log(optionChanged)
    }
  }

  SaveOptions() {
    this.templateSelected = false;
    this.quoteOptionsModel._id = null;
    let payload = {}
    payload['record'] = this.quoteOptionsModel;
    payload['quoteId'] = this.quoteOptionsModel.quoteId;
    if (this.templateName == AllowedProductTemplate.LIABILITY_EANDO) {
      this.optionsServiceEandO.createAndUpdateOption(payload).subscribe({
        next: (quote: any) => {
          this.isExpiryDisable = false;
          this.dialogRef.close();
          if (this.routeToDraft) this.routerService.navigateByUrl(`/backend/quotes/${this.quoteId}?quoteOptionId=${quote.data.entity._id}`)
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option Added Successfully`,
            life: 3000
          });
          this.getOptions();
          this.isAdded = !this.isAdded
        },
        error: error => {
          console.log(error);
        }
      });
    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY || this.templateName == AllowedProductTemplate.LIABILITY_CRIME) {
      this.optionsServiceDandOCrime.createAndUpdateOption(payload).subscribe({
        next: (quote: any) => {
          this.isExpiryDisable = false;
          this.dialogRef.close();
          if (this.routeToDraft) this.routerService.navigateByUrl(`/backend/quotes/${this.quoteId}?quoteOptionId=${quote.data.entity._id}`)
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option Added Successfully`,
            life: 3000
          });
          this.getOptions();
          this.isAdded = !this.isAdded
        },
        error: error => {
          console.log(error);
        }
      });
    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY_CGL || this.templateName == AllowedProductTemplate.LIABILITY_PUBLIC) {
      this.optionsServiceCGLPublic.createAndUpdateOption(payload).subscribe({
        next: (quote: any) => {
          this.isExpiryDisable = false;
          this.dialogRef.close();
          if (this.routeToDraft) this.routerService.navigateByUrl(`/backend/quotes/${this.quoteId}?quoteOptionId=${quote.data.entity._id}`)
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option Added Successfully`,
            life: 3000
          });
          this.getOptions();
          this.isAdded = !this.isAdded
        },
        error: error => {
          console.log(error);
        }
      });
    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY_PRODUCT || this.templateName == AllowedProductTemplate.LIABILITY_CYBER) {
      this.optionsServiceProductCyber.createAndUpdateOption(payload).subscribe({
        next: (quote: any) => {
          this.isExpiryDisable = false;
          this.dialogRef.close();
          if (this.routeToDraft) this.routerService.navigateByUrl(`/backend/quotes/${this.quoteId}?quoteOptionId=${quote.data.entity._id}`)
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option Added Successfully`,
            life: 3000
          });
          this.getOptions();
          this.isAdded = !this.isAdded
        },
        error: error => {
          console.log(error);
        }
      });
    }
    else if (this.templateName == AllowedProductTemplate.WORKMENSCOMPENSATION) {
      this.optionsServiceWC.createAndUpdateOption(payload).subscribe({
        next: (quote: any) => {
          this.isExpiryDisable = false;
          this.dialogRef.close();
          if (this.routeToDraft) this.routerService.navigateByUrl(`/backend/quotes/${this.quoteId}?quoteOptionId=${quote.data.entity._id}`)
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Option Added Successfully`,
            life: 3000
          });
          this.getOptions();
          this.isAdded = !this.isAdded
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  onRadioChange(no: any) {
    this.templateSelected = true;
    let temptoAdd = this.quoteOptionsLst.filter(x => x.optionName == 'Option ' + no)[0]
    if (!temptoAdd) {
      temptoAdd = this.quoteOptionsLst.filter(x => x.optionName == 'Expired')[0]
    }
    this.quoteOptionsModel._id = null;
    if (this.templateName == AllowedProductTemplate.LIABILITY_EANDO) {
      Object.assign(this.quoteOptionsModel, {
        quoteId: temptoAdd.quoteId,
        insuredBusinessActivityId: temptoAdd.insuredBusinessActivityId,
        insuredBusinessActivityOther: temptoAdd.insuredBusinessActivityOther,
        limitOfLiability: temptoAdd.limitOfLiability,
        isOfferIndication: temptoAdd.isOfferIndication,
        detailsOfBusinessActivity: temptoAdd.detailsOfBusinessActivity,
        typeOfPolicy: temptoAdd.typeOfPolicy,
        numberOfExperienceId: temptoAdd.numberOfExperienceId,
        retroactiveCoverId: temptoAdd.retroactiveCoverId,
        retroactiveDate: temptoAdd.retroactiveDate,
        totalPremiumAmt: temptoAdd.totalPremiumAmt,
        additionalInformation: temptoAdd.additionalInformation,
        juridictionId: temptoAdd.juridictionId,
        territoryId: temptoAdd.territoryId,
        subsidairyAnnualReportFilePath: temptoAdd.subsidairyAnnualReportFilePath,
        subsidaryDetails: temptoAdd.subsidaryDetails,
        isOptionSelected: true,
        selectedFromOptionNo: temptoAdd.optionName,
        isAccepted: temptoAdd.isAccepted,
        isQuoteOptionPlaced: temptoAdd.isQuoteOptionPlaced,
        revenueDetails: temptoAdd.revenueDetails,
        liabiltyDeductibles: temptoAdd.liabiltyDeductibles,
        liabiltyCovers: temptoAdd.liabiltyCovers,
        basicDetailsAttchments: temptoAdd.basicDetailsAttchments,
        subjectivity: temptoAdd.subjectivity,
        majorExclusions: temptoAdd.majorExclusions,
        version: this.quote.qcrVersion
      });

    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY || this.templateName == AllowedProductTemplate.LIABILITY_CRIME) {
      Object.assign(this.quoteOptionsModel, {
        insuredBusinessActivityId: temptoAdd.insuredBusinessActivityId,
        insuredBusinessActivityOther: temptoAdd.insuredBusinessActivityOther,
        limitOfLiability: temptoAdd.limitOfLiability,
        isOfferIndication: temptoAdd.isOfferIndication,
        quoteId: temptoAdd.quoteId,
        detailsOfBusinessActivity: temptoAdd.detailsOfBusinessActivity,
        typeOfPolicyId: temptoAdd.typeOfPolicyId,
        natureOfBusinessId: temptoAdd.natureOfBusinessId,
        ageOfCompanyId: temptoAdd.ageOfCompanyId,
        retroactiveCoverId: temptoAdd.retroactiveCoverId,
        dateOfIncorporation: temptoAdd.dateOfIncorporation,
        auditedReportFilePath: temptoAdd.auditedReportFilePath,
        proposalFormFilePath: temptoAdd.proposalFormFilePath,
        anyAdditionalInfoFilePath: temptoAdd.anyAdditionalInfoFilePath,
        totalPremiumAmt: temptoAdd.totalPremiumAmt,
        aoaAoyId: temptoAdd.aoaAoyId,
        anyOneAccident: temptoAdd.anyOneAccident,
        inTheAggregate: temptoAdd.inTheAggregate,
        additionalInformation: temptoAdd.additionalInformation,
        juridictionId: temptoAdd.juridictionId,
        territoryId: temptoAdd.territoryId,
        employeesDetails: temptoAdd.employeesDetails,
        totalNumberOfEmployees: temptoAdd.totalNumberOfEmployees,
        juridiction: temptoAdd.juridiction,
        territory: temptoAdd.territory,
        subJoinVentureDocsFilePath: temptoAdd.subJoinVentureDocsFilePath,
        subJoinVentureDocsFileName: temptoAdd.subJoinVentureDocsFileName,
        subsidaryDetails: temptoAdd.subsidaryDetails,
        isBreakupRevenueORTurnover: temptoAdd.isBreakupRevenueORTurnover,
        liabiltyCovers: temptoAdd.liabiltyCovers,
        liabiltyDeductibles: temptoAdd.liabiltyDeductibles,
        basicDetailsAttchments: temptoAdd.basicDetailsAttchments,
        revenueDetails: temptoAdd.revenueDetails,
        subjectivity: temptoAdd.subjectivity,
        majorExclusions: temptoAdd.majorExclusions,
        isOptionSelected: true,
        selectedFromOptionNo: temptoAdd.optionName,
        isAccepted: temptoAdd.isAccepted,
        isQuoteOptionPlaced: temptoAdd.isQuoteOptionPlaced,
        version: this.quote.qcrVersion
      });

    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY_CGL || this.templateName == AllowedProductTemplate.LIABILITY_PUBLIC) {
      Object.assign(this.quoteOptionsModel, {
        quoteId: temptoAdd.quoteId,
        listOfLocations: temptoAdd.listOfLocations,
        insuredBusinessActivityId: temptoAdd.insuredBusinessActivityId,
        insuredBusinessActivityOther: temptoAdd.insuredBusinessActivityOther,
        limitOfLiability: temptoAdd.limitOfLiability,
        isOfferIndication: temptoAdd.isOfferIndication,
        typeOfProductId: temptoAdd.typeOfProductId,
        typeOfPolicyId: temptoAdd.typeOfPolicyId,
        typeOfPolicy: temptoAdd.typeOfPolicy,
        detailsOfHazardousChemical: temptoAdd.detailsOfHazardousChemical,
        aoaAoyId: temptoAdd.aoaAoyId,
        anyOneAccident: temptoAdd.anyOneAccident,
        inTheAggregate: temptoAdd.inTheAggregate,
        jurasdiction: temptoAdd.jurasdiction,
        territory: temptoAdd.territory,
        retroactiveCoverId: temptoAdd.retroactiveCoverId,
        detailsOfProductAndUsage: temptoAdd.detailsOfProductAndUsage,
        detailsOfBusinessActivity: temptoAdd.detailsOfBusinessActivity,
        additionalInformation: temptoAdd.additionalInformation,
        retroactiveDate: temptoAdd.retroactiveDate,
        totalPremiumAmt: temptoAdd.totalPremiumAmt,
        juridictionId: temptoAdd.juridictionId,
        territoryId: temptoAdd.territoryId,
        subsidaryDetails: temptoAdd.subsidaryDetails,
        turnOverDetails: temptoAdd.turnOverDetails,
        liabiltyCovers: temptoAdd.liabiltyCovers,
        basicDetailsAttchments: temptoAdd.basicDetailsAttchments,
        subjectivity: temptoAdd.subjectivity,
        majorExclusions: temptoAdd.majorExclusions,
        liabiltyDeductibles: temptoAdd.liabiltyDeductibles,
        isOptionSelected: true,
        selectedFromOptionNo: temptoAdd.optionName,
        isAccepted: temptoAdd.isAccepted,
        isQuoteOptionPlaced: temptoAdd.isQuoteOptionPlaced,
        version: this.quote.qcrVersion
      });
    }
    else if (this.templateName == AllowedProductTemplate.LIABILITY_PRODUCT || this.templateName == AllowedProductTemplate.LIABILITY_CYBER) {
      Object.assign(this.quoteOptionsModel, {
        quoteId: temptoAdd.quoteId,
        insuredBusinessActivityId: temptoAdd.insuredBusinessActivityId,
        insuredBusinessActivityOther: temptoAdd.insuredBusinessActivityOther,
        limitOfLiability: temptoAdd.limitOfLiability,
        isOfferIndication: temptoAdd.isOfferIndication,
        detailsOfBusinessActivity: temptoAdd.detailsOfBusinessActivity,
        typeOfPolicyId: temptoAdd.typeOfPolicyId,
        numberOfExperienceId: temptoAdd.numberOfExperienceId,
        retroactiveCoverId: temptoAdd.retroactiveCoverId,
        detailsOfProductAndUsage: temptoAdd.detailsOfProductAndUsage,
        retroactiveDate: temptoAdd.retroactiveDate,
        totalPremiumAmt: temptoAdd.totalPremiumAmt,
        juridictionId: temptoAdd.juridictionId,
        territoryId: temptoAdd.territoryId,
        juridiction: temptoAdd.juridiction,
        territory: temptoAdd.territory,
        subsidaryDetails: temptoAdd.subsidaryDetails,
        turnOverDetails: temptoAdd.turnOverDetails,
        liabiltyCovers: temptoAdd.liabiltyCovers,
        basicDetailsAttchments: temptoAdd.basicDetailsAttchments,
        liabiltyDeductibles: temptoAdd.liabiltyDeductibles,
        additionalInformation: temptoAdd.additionalInformation,
        subjectivity: temptoAdd.subjectivity,
        majorExclusions: temptoAdd.majorExclusions,
        isOptionSelected: true,
        selectedFromOptionNo: temptoAdd.optionName,
        isAccepted: temptoAdd.isAccepted,
        isQuoteOptionPlaced: temptoAdd.isQuoteOptionPlaced,
        version: this.quote.qcrVersion
      });

    }
    else if (this.templateName == AllowedProductTemplate.WORKMENSCOMPENSATION) {
      Object.assign(this.quoteOptionsModel, {
        quoteId: temptoAdd.quoteId,
        insuredBusinessActivityId: temptoAdd.insuredBusinessActivityId,
        insuredBusinessActivityOther: temptoAdd.insuredBusinessActivityOther,
        isOfferIndication: temptoAdd.isOfferIndication,
        wcCoverAddOnCovers: temptoAdd.wcCoverAddOnCovers,
        medicalBenifits: temptoAdd.medicalBenifits,
        medicalBenifitsAns: temptoAdd.medicalBenifitsAns,
        medicalBenifitsAmount: temptoAdd.medicalBenifitsAmount,
        medicalBenifitsAmountId: temptoAdd.medicalBenifitsAmountId,
        allmedicalBenifitsYesNo: temptoAdd.allmedicalBenifitsYesNo,
        targetPremium: temptoAdd.targetPremium,
        indicativePremium: temptoAdd.indicativePremium,
        discountbasedonPremium: temptoAdd.discountbasedonPremium,
        addonCoversAmount: temptoAdd.addonCoversAmount,
        totalPremiumAmt: temptoAdd.totalPremiumAmt,
        underWriteradjustedPremium: temptoAdd.underWriteradjustedPremium,
        underWritertargetPremium: temptoAdd.underWritertargetPremium,
        underWriterindicativePremium: temptoAdd.underWriterindicativePremium,
        underWriterdiscountbasedonPremium: temptoAdd.underWriterdiscountbasedonPremium,
        underWriteraddonCoversAmount: temptoAdd.underWriteraddonCoversAmount,
        underWritertotalPremiumAmt: temptoAdd.underWritertotalPremiumAmt,
        underWritermedicalBenifitsAmount: temptoAdd.underWritermedicalBenifitsAmount,
        underWritermedicalBenifitsAmountId: temptoAdd.underWritermedicalBenifitsAmountId,
        underWritermedicalBenifitsOption: temptoAdd.underWritermedicalBenifitsOption,
        underWriterisActual: temptoAdd.underWriterisActual,
        safetyMeasures: temptoAdd.safetyMeasures,
        wcDetails: temptoAdd.wcDetails,
        medicalBenifitsOption: temptoAdd.medicalBenifitsOption,
        isActual: temptoAdd.isActual,
        previousCompany: temptoAdd.previousCompany,
        previousPolicyno: temptoAdd.previousPolicyno,
        previousStartdate: temptoAdd.previousStartdate,
        previousEnddate: temptoAdd.previousEnddate,
        subjectivity: temptoAdd.subjectivity,
        majorExclusions: temptoAdd.majorExclusions,
        liabiltyDeductibles: temptoAdd.liabiltyDeductibles,
        isOptionSelected: true,
        selectedFromOptionNo: temptoAdd.optionName,
        isAccepted: temptoAdd.isAccepted,
        isQuoteOptionPlaced: temptoAdd.isQuoteOptionPlaced,
        liabiltyCovers: temptoAdd.liabiltyCovers,
        basicDetailsAttchments: temptoAdd.basicDetailsAttchments,
        juridiction: temptoAdd.juridiction,
        territory: temptoAdd.territory,
        version: this.quote.qcrVersion,
        tableType: temptoAdd.tableType
      });
    }
  }
}
