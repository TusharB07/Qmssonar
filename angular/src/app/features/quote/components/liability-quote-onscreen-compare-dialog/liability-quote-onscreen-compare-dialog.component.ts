import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { ICGLTemplate, liabiltyAddOnCovers } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-liability-quote-onscreen-compare-dialog',
  templateUrl: './liability-quote-onscreen-compare-dialog.component.html',
  styleUrls: ['./liability-quote-onscreen-compare-dialog.component.scss']
})
export class LiabilityQuoteOnscreenCompareDialogComponent implements OnInit {
  quote: any;
  optionLists: any[];
  questionAnswerListToBind: any[] = [];
  product: IProduct;
  optionOneTemplate: any;
  optionTwoTemplate: any;
  isDandOProduct: boolean
  isCGLProduct: boolean
  isEandOOProduct: boolean
  isWCProdduct: boolean;
  isPublicProduct: boolean;
  isCyberProduct: boolean;
  isCrimeProduct: boolean;
  selectedDropdown: any;
  optionsQuoteOptions: any;
  tabs: MenuItem[] = [];
  mapping: any[] = [];
  private currentSelectedTemplate: Subscription;
  sumit: any[] = [];
  optionTwo: any
  selectedOptions: ILov[] = [];
  tabMappings: { [key: string]: any[] } = {};
  selectedQuoteTemplate: any;
  covers: liabiltyAddOnCovers[]
  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef, private quoteService: QuoteService, private messageService: MessageService) {
    this.quote = this.config.data.quote;
    this.product = this.quote.productId;
    this.product.productTemplate == AllowedProductTemplate.LIABILITY ? this.isDandOProduct = true : this.isDandOProduct = false
    this.product.productTemplate == AllowedProductTemplate.LIABILITY_CGL ? this.isCGLProduct = true : this.isCGLProduct = false
    this.product.productTemplate == AllowedProductTemplate.LIABILITY_CRIME ? this.isCrimeProduct = true : this.isCrimeProduct = false
    this.product.productTemplate == AllowedProductTemplate.LIABILITY_CYBER ? this.isCyberProduct = true : this.isCyberProduct = false
    this.product.productTemplate == AllowedProductTemplate.LIABILITY_EANDO ? this.isEandOOProduct = true : this.isEandOOProduct = false
    this.product.productTemplate == AllowedProductTemplate.LIABILITY_PUBLIC ? this.isPublicProduct = true : this.isPublicProduct = false
    this.product.productTemplate == AllowedProductTemplate.WORKMENSCOMPENSATION ? this.isWCProdduct = true : this.isWCProdduct = false
    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.selectedQuoteTemplate = template;
        this.covers = this.selectedQuoteTemplate['liabiltyCovers']
      },
    });
  }

  isOptionDisabled(option: any): boolean {
    return this.selectedOptions.length === 2; // Disable all options if 2 are selected
  }

  async compareLiabilityQuoteOptionsDialog(): Promise<void> {
    if (this.selectedOptions.length === 2) {
      try {
        this.optionOneTemplate = this.optionLists.find(x => x._id === this.selectedOptions[0].value);
        this.optionTwoTemplate = this.optionLists.find(x => x._id === this.selectedOptions[1].value);
        this.mapping = [];
        this.tabs = this.loadTabs(this.product);
        for (const tab of this.tabs) {
          await this.loadTabDetails(tab);
        }
        this.optionTwo = this.optionTwoTemplate;
      } catch (error) {
        console.error('Error during tab loading:', error);
        this.messageService.add({
          key: "error",
          severity: "error",
          detail: "An error occurred while loading tab details."
        });
      }
    } else {
      this.messageService.add({
        key: "error",
        severity: "error",
        detail: "Select only two options for comparison."
      });
    }
  }




  async ngOnInit(): Promise<void> {
    try {
      const dto: IOneResponseDto<any[]> = await this.quoteService
        .getAllLiabilityQuoteOptions(this.quote._id, true)
        .toPromise();
      this.optionsQuoteOptions = dto.data.entity
        .filter(x => x.version === this.quote.qcrVersion)
        .map(entity => ({ label: entity.optionName, value: entity._id }));
      this.optionLists = dto.data.entity.filter(x => x.version === this.quote.qcrVersion);
      if (this.optionLists.length >= 2) {
        this.optionOneTemplate = this.optionLists[0];
        this.optionTwoTemplate = this.optionLists[1];
        this.selectedDropdown = this.optionLists[1]._id;
      } else {
        console.warn('Insufficient options for comparison');
        this.optionOneTemplate = this.optionLists[0] || null;
        this.optionTwoTemplate = null;
        this.selectedDropdown = null;
      }
      this.tabs = this.loadTabs(this.product);
      for (const tab of this.tabs) {
        await this.loadTabDetails(tab);
      }
      this.optionTwo = this.optionTwoTemplate;
    } catch (error) {
      console.error(error);
    }
  }






  loadTabs(product: IProduct): MenuItem[] {
    switch (product.productTemplate) {
      case AllowedProductTemplate.LIABILITY_CGL:
        return [
          { label: "Draft Details", id: "draft_details" },
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Add-On Covers", id: "liability_addons" },
        ]
      case AllowedProductTemplate.LIABILITY:
        return [
          { label: "Draft Details", id: "draft_details" },
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Add-On Covers", id: "liability_addons" },
        ]
      case AllowedProductTemplate.LIABILITY_PUBLIC:
        return [
          { label: "Draft Details", id: "draft_details" },
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
        ]
      case AllowedProductTemplate.LIABILITY_CRIME:
        return [
          { label: "Draft Details", id: "draft_details" },
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Add-On Covers", id: "liability_addons" },
        ]
      case AllowedProductTemplate.LIABILITY_CYBER:
        return [
          { label: "Draft Details", id: "draft_details" },
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Add-On Covers", id: "liability_addons" },
        ]
      case AllowedProductTemplate.LIABILITY_EANDO:
        return [
          { label: "Draft Details", id: "draft_details" },
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Add-On Covers", id: "liability_addons" },
        ]
      case AllowedProductTemplate.LIABILITY_PRODUCT:
        return [
          { label: "Draft Details", id: "draft_details" },
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Add-On Covers", id: "liability_addons" },
        ]
      case AllowedProductTemplate.WORKMENSCOMPENSATION:
        return [
          { label: "Draft Details", id: "draft_details" },
          { label: "Medical Details", id: "medical_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Add-On Covers", id: "liability_addons" },
        ]

      default:
        return [
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Breakup Details", id: 'revenue_details' },
          { label: "Deductibles & Claim Experience", id: 'deductibles' },
          { label: "Other Details", id: "other_details" },
        ]
    }
  }

  async loadTabDetails(tab?: MenuItem) {
    if (!tab || !this.optionOneTemplate || !this.optionTwoTemplate) {
      console.warn('Tab, optionOneTemplate, or optionTwoTemplate is undefined.');
      return;
    }
    switch (tab.id) {
      case 'draft_details':
        this.tabMappings['draft_details'] = [
          {
            labels: { type: 'string', value: "Insured Business Activity" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.insuredBusinessActivityId?.lovKey || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.insuredBusinessActivityId?.lovKey || 'N/A',
              style: this.optionTwoTemplate.insuredBusinessActivityId?.lovKey !== this.optionOneTemplate.insuredBusinessActivityId?.lovKey ? { color: 'red' } : null,
            },
          },
          {
            labels: { type: 'string', value: "Insured Business Activity Other" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.insuredBusinessActivityOther || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.insuredBusinessActivityOther || 'N/A',
              style: this.optionTwoTemplate.insuredBusinessActivityOther !== this.optionOneTemplate.insuredBusinessActivityOther ? { color: 'red' } : null,
            },
          },
          {
            labels: { type: 'string', value: "Offer Indication Applicable?" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.isOfferIndication ? 'Yes' : 'No'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.isOfferIndication ? 'Yes' : 'No',
              style: this.optionTwoTemplate.isOfferIndication !== this.optionOneTemplate.isOfferIndication ? { color: 'red' } : null,
            },
          },
        ];
        if (this.isCGLProduct) {
          this.tabMappings['draft_details'].push({
            labels: { type: 'string', value: "Type of Product" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.typeOfProductId ? 'Yes' : 'No'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.isOfferIndication ? 'Yes' : 'No',
              style: this.optionTwoTemplate.isOfferIndication !== this.optionOneTemplate.isOfferIndication ? { color: 'red' } : null,
            },
          })
        }
        if (!this.isWCProdduct) {
          this.tabMappings['draft_details'].push({
            labels: { type: 'string', value: "Limit of Liability" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.limitOfLiability || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.limitOfLiability || 'N/A',
              style: this.optionTwoTemplate.limitOfLiability !== this.optionOneTemplate.limitOfLiability ? { color: 'red' } : null,
            },
          });
        }
        break;
      case 'basic_details':
        this.tabMappings['basic_details'] = [
          {
            labels: { type: 'string', value: "Details of Business Activity" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.detailsOfBusinessActivity || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.detailsOfBusinessActivity || 'N/A',
              style: this.optionTwoTemplate.detailsOfBusinessActivity !== this.optionOneTemplate.detailsOfBusinessActivity ? { color: 'red' } : null,
            },
          },
          {
            labels: { type: 'string', value: "Retroactive Details" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.retroactiveCoverId?.lovKey || 'N/A',
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.retroactiveCoverId?.lovKey || 'N/A',
              style:
                this.optionTwoTemplate.retroactiveCoverId?.lovKey !== this.optionOneTemplate.retroactiveCoverId?.lovKey
                  ? { color: 'red' }
                  : null,
            },
          },
          {
            labels: { type: 'string', value: "Retroactive Date" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.retroactiveDate || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.retroactiveDate || 'N/A',
              style: this.optionTwoTemplate.retroactiveDate !== this.optionOneTemplate.retroactiveDate ? { color: 'red' } : null,
            },
          },
          {
            labels: { type: 'string', value: "Additional Information" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.additionalInformation || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.additionalInformation || 'N/A',
              style: this.optionTwoTemplate.additionalInformation !== this.optionOneTemplate.additionalInformation ? { color: 'red' } : null,
            },
          }
        ];
        if (this.isCGLProduct || this.isEandOOProduct) {
          this.tabMappings['basic_details'].push({
            labels: { type: 'string', value: "Type of Policy" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.isCGLProduct
                ? this.optionOneTemplate.typeOfPolicyId?.lovKey || 'N/A'
                : this.optionOneTemplate.typeOfPolicy || 'N/A',
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.isCGLProduct
                ? this.optionTwoTemplate.typeOfPolicyId?.lovKey || 'N/A'
                : this.optionTwoTemplate.typeOfPolicy || 'N/A',
              style: this.isCGLProduct
                ? this.optionTwoTemplate.typeOfPolicyId?.lovKey !== this.optionOneTemplate.typeOfPolicyId?.lovKey
                  ? { color: 'red' }
                  : null
                : this.optionTwoTemplate.typeOfPolicy !== this.optionOneTemplate.typeOfPolicy
                  ? { color: 'red' }
                  : null,
            },
          });
        }
        if (this.isPublicProduct) {
          this.tabMappings['basic_details'].push({
            labels: { type: 'string', value: "Details of Hazardous Chemicals" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.detailsOfHazardousChemical || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.detailsOfHazardousChemical || 'N/A',
              style: this.optionTwoTemplate.detailsOfHazardousChemical !== this.optionOneTemplate.detailsOfHazardousChemical ? { color: 'red' } : null,
            },
          });
        }
        if (this.isCrimeProduct) {
          this.tabMappings['basic_details'].push({
            labels: { type: 'string', value: "Total number of Employees" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.totalNumberOfEmployees || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.totalNumberOfEmployees || 'N/A',
              style: this.optionTwoTemplate.totalNumberOfEmployees !== this.optionOneTemplate.totalNumberOfEmployees ? { color: 'red' } : null,
            },
          });
        }
        break;
      case 'territorysubsidiary':
        this.tabMappings['territorysubsidiary'] = [
          {
            labels: { type: 'string', value: "Territory" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: (this.isDandOProduct || this.isPublicProduct || this.isWCProdduct)
                ? this.optionOneTemplate.territory || 'N/A'
                : this.optionOneTemplate.territoryId?.lovKey || 'N/A',
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: (this.isDandOProduct || this.isPublicProduct || this.isWCProdduct)
                ? this.optionTwoTemplate.territory || 'N/A'
                : this.optionTwoTemplate.territoryId?.lovKey || 'N/A',
              style: (this.isDandOProduct || this.isPublicProduct || this.isWCProdduct)
                ? this.optionTwoTemplate.territory !== this.optionOneTemplate.territory
                  ? { color: 'red' }
                  : null
                : this.optionTwoTemplate.territoryId?.lovKey !== this.optionOneTemplate.territoryId?.lovKey
                  ? { color: 'red' }
                  : null,
            },
          },
          {
            labels: { type: 'string', value: "Jurisdiction" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: (this.isDandOProduct || this.isPublicProduct || this.isWCProdduct)
                ? this.optionOneTemplate.juridiction || 'N/A'
                : this.optionOneTemplate.juridictionId?.lovKey || 'N/A',
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: (this.isDandOProduct || this.isPublicProduct || this.isWCProdduct)
                ? this.optionTwoTemplate.juridiction || 'N/A'
                : this.optionTwoTemplate.juridictionId?.lovKey || 'N/A',
              style: (this.isDandOProduct || this.isPublicProduct || this.isWCProdduct)
                ? this.optionTwoTemplate.juridiction !== this.optionOneTemplate.juridiction
                  ? { color: 'red' }
                  : null
                : this.optionTwoTemplate.juridictionId?.lovKey !== this.optionOneTemplate.juridictionId?.lovKey
                  ? { color: 'red' }
                  : null,
            },
          }
        ];
        break;
      case 'liability_addons':
        if (!this.isPublicProduct) {
          this.tabMappings['liability_addons'] = []
          this.covers.forEach((masterCover) => {
            const coverOne = this.optionOneTemplate.liabiltyCovers.find(c => c.id === masterCover.id) || {};
            const coverTwo = this.optionTwoTemplate.liabiltyCovers.find(c => c.id === masterCover.id) || {};
            this.tabMappings['liability_addons'].push({
              labels: { type: 'string', value: masterCover.name },
              [this.optionOneTemplate._id]: {
                type: 'string',
                value: coverOne?.optionSelected || 'N/A',
              },
              [this.optionTwoTemplate._id]: {
                type: 'string',
                value: coverTwo?.optionSelected || 'N/A',
                style: (coverOne?.optionSelected || 'N/A') !== (coverTwo?.optionSelected || 'N/A') ? { color: 'red' } : null,
              },
            });
          });
        }
        break;
      case "medical_details":
        this.tabMappings['medical_details'] = [
          {
            labels: { type: 'string', value: "Medical Extension Benifits" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.medicalBenifitsOption == 'ME' ? 'Medical Extension' : 'Medical Extension Aggregate'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.medicalBenifitsOption == 'ME' ? 'Medical Extension' : 'Medical Extension Aggregate',
              style: this.optionTwoTemplate.medicalBenifitsOption !== this.optionOneTemplate.medicalBenifitsOption ? { color: 'red' } : null,
            },
          },
          {
            labels: { type: 'string', value: "is Actual?" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.isActual ? 'Yes' : 'No'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.isActual ? 'Yes' : 'No',
              style: this.optionTwoTemplate.isActual !== this.optionOneTemplate.isActual ? { color: 'red' } : null,
            },
          },
          {
            labels: { type: 'string', value: "Amount" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.medicalBenifitsAmount || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.medicalBenifitsAmount || 'N/A',
              style: this.optionTwoTemplate.medicalBenifitsAmount !== this.optionOneTemplate.medicalBenifitsAmount ? { color: 'red' } : null,
            },
          },
          {
            labels: { type: 'string', value: "Discount" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.discountbasedonPremium || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.discountbasedonPremium || 'N/A',
              style: this.optionTwoTemplate.discountbasedonPremium !== this.optionOneTemplate.discountbasedonPremium ? { color: 'red' } : null,
            },
          },
          {
            labels: { type: 'string', value: "Safety Measures" },
            [this.optionOneTemplate._id]: {
              type: 'string',
              value: this.optionOneTemplate.safetyMeasures || 'N/A'
            },
            [this.optionTwoTemplate._id]: {
              type: 'string',
              value: this.optionTwoTemplate.safetyMeasures || 'N/A',
              style: this.optionTwoTemplate.safetyMeasures !== this.optionOneTemplate.safetyMeasures ? { color: 'red' } : null,
            },
          },
        ];
        break;
      default:
        break;
    }
  }
}
