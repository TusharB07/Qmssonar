import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ILov, IManyResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { LIABILITY_COVERS_OPTIONS } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IProductLiabilityTemplate, IQuoteSlip, SubjectivityAndMajorExclusions, SubsidiaryProductDetails, liabiltyProductAddOnCovers, liabiltyProductDeductibles, uploadAttachmentDetails } from 'src/app/features/admin/quote/quote.model';

@Component({
  selector: 'app-sub-template-liability-pl',
  templateUrl: './sub-template-liability-pl.component.html',
  styleUrls: ['./sub-template-liability-pl.component.scss']
})
export class SubTemplateProductLiabilityCGLComponent implements OnInit {
  @Input() quote: IQuoteSlip;
  private currentQuote: Subscription;
  quoteId: string = "";
  quotePLOptions: any;
  private currentSelectedTemplate: Subscription;
  AllowedProductTemplate = AllowedProductTemplate;
  role: IRole
  AllowedRoles = AllowedRoles
  fileDetails: uploadAttachmentDetails[] = [];
  subsidaryDetails: SubsidiaryProductDetails[] = [];
  liabiltyCovers: liabiltyProductAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  claimExperiences: IClaimExperience[] = []
  optionsInsuredBusinessActivity: ILov[] = []
  insuredBusinessActivity: string = ""
  showExclusionAndSubjectivity: boolean = false
  deductiblesInfo: liabiltyProductDeductibles[] = [];
  majorExclusions: SubjectivityAndMajorExclusions[] = []
  subjectivities: SubjectivityAndMajorExclusions[] = []
  cols: ILov[] = [
    { value: 'period', label: 'Period/Locations' },
    { value: 'firstYear', label: '' },
    { value: 'secondyear', label: '' },
    { value: 'thirdYear', label: '' },
    { value: 'EstForNextYear', label: 'Est for next year' },
  ];
  rows: ILov[] = [
    { value: 'india', label: 'India' },
    { value: 'unitedKingdom', label: 'United Kingdom' },
    { value: 'europe', label: 'Europe' },
    { value: 'usaCanada', label: 'USA/Canada' },
    { value: 'ROW', label: 'ROW (Rest of World)' },
    { value: 'total', label: 'Total' },
  ];

  constructor(private wclistofmasterservice: WCListOfValueMasterService, private accountService: AccountService, private quoteService: QuoteService, private claimExperienceService: ClaimExperienceService, private appService: AppService, private liabilityProductTemplateService: liabilityProductTemplateService) {
    this.accountService.currentUser$.subscribe({
      next: user => {
        const role: IRole = user.roleId as IRole;
        if (AllowedRoles.INSURER_UNDERWRITER != role?.name) {
          this.showExclusionAndSubjectivity = false;
        }
        else {
          this.showExclusionAndSubjectivity = true;
        }
      }
    });
    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        if ([AllowedProductTemplate.LIABILITY_PRODUCT].includes(this.quote?.productId['productTemplate']) || [AllowedProductTemplate.LIABILITY_CYBER].includes(this.quote?.productId['productTemplate'])) {
          this.liabilityProductTemplateService.getTemplateById(template._id, template.quoteId).subscribe({
            next: quoteLiablitity => {
              if (quoteLiablitity) {
                this.quotePLOptions = quoteLiablitity.data.entity
                this.subsidaryDetails = this.quotePLOptions.subsidaryDetails
                this.fileDetails = this.quotePLOptions.basicDetailsAttchments;
                this.subsidaryDetails.forEach(element => {
                  if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
                    element.activityName = 'N/A'
                  }

                });
                this.deductiblesInfo = this.quotePLOptions.liabiltyDeductibles
                this.liabiltyCovers = this.quotePLOptions.liabiltyCovers.filter(x => x.isSelected)
                this.liabiltyCovers.forEach(element => {
                  if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
                    element.optionSelected = 'N/A'
                  }

                  if (element.description == '' || element.description == null || element.description == undefined) {
                    element.description = 'N/A'
                  }
                });
                this.majorExclusions = this.quotePLOptions.majorExclusions
                this.subjectivities = this.quotePLOptions.subjectivity
              }
              this.loadInsuredBusinessActivity()
            },
            error: error => {
              console.log(error);
            }

          });
        }
      }
    })
    this.optionCovers = LIABILITY_COVERS_OPTIONS;
    this.updateYears()

  }

  updateYears() {
    const currentYear = new Date().getFullYear();
    this.cols[3].label = currentYear.toString();
    this.cols[2].label = (currentYear - 1).toString();
    this.cols[1].label = (currentYear - 2).toString();
  }
  getTotalfirstYear() {
    const firstYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.firstYear;
    }, 0);
    return firstYear;
  }

  getTotalsecondYear() {
    const secondYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.secondYear;
    }, 0);
    return secondYear;
  }

  getTotalthirdYear() {
    const thirdYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.thirdYear;
    }, 0);
    return thirdYear;
  }

  getTotalestimatedForNextYear() {
    const estimatedForNextYear = this.quotePLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.estimatedForNextYear;
      ;
    }, 0);
    return estimatedForNextYear;
  }

  loadInsuredBusinessActivity() {
    this.wclistofmasterservice.current((this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY_PRODUCT)
      ? WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_INSURED_BUSINESS_ACTIVITY
      : WCAllowedListOfValuesMasters.CYBER_LIABILITY_INSURED_BUSINESS_ACTIVITY).subscribe({
        next: records => {
          if (records.data.entities.length > 0) {
            records.data.entities = records.data.entities.sort((a, b) => (a.lovKey < b.lovKey ? -1 : 1));
          }
          this.optionsInsuredBusinessActivity = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
          this.insuredBusinessActivity = this.optionsInsuredBusinessActivity.find(s => s.value == this.quotePLOptions.insuredBusinessActivityId).label;
        },
        error: e => {
          console.log(e);
        }
      });
  }


  ngOnInit(): void {

    // this.currentQuote = this.quoteService.currentQuote$.subscribe({
    //   next: (quote) => {
    //     this.quote = quote
    this.quoteId = this.quote._id;
    if (!this.showExclusionAndSubjectivity && !this.quote.insurerProcessedQuotes) {
      if (this.quote.quoteState == 'QCR From Underwritter' || this.quote.quoteState == 'Under Writter Review') {
        this.showExclusionAndSubjectivity = true;
      }
    }
    let templateId =  this.quote?.liabilityProductTemplateDataId["_id"] ||  this.quote?.liabilityProductTemplateDataId     
    this.liabilityProductTemplateService.getTemplateById(templateId, this.quoteId).subscribe({
      next: quoteLiablitity => {
        this.quotePLOptions = quoteLiablitity.data.entity
        this.subsidaryDetails = this.quotePLOptions.subsidaryDetails
        this.fileDetails = this.quotePLOptions.basicDetailsAttchments;
        this.subsidaryDetails.forEach(element => {
          if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
            element.activityName = 'N/A'
          }


        });
        this.deductiblesInfo = this.quotePLOptions.liabiltyDeductibles
        this.liabiltyCovers = this.quotePLOptions.liabiltyCovers.filter(x => x.isSelected)
        this.liabiltyCovers.forEach(element => {
          if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
            element.optionSelected = 'N/A'
          }

          if (element.description == '' || element.description == null || element.description == undefined) {
            element.description = 'N/A'
          }
        });
        this.majorExclusions = this.quotePLOptions.majorExclusions
        this.subjectivities = this.quotePLOptions.subjectivity
        this.loadInsuredBusinessActivity()
      },
      error: error => {
        console.log(error);
      }

    });
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 5,
      sortField: '_id',
      sortOrder: -1,
      filters: {
        // @ts-ignore
        quoteId: [
          {
            value: this.quote._id,
            matchMode: "equals",
            operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    };

    if (this.quote.quoteState == 'QCR From Underwritter') {
      this.claimExperienceService.getClaimsExperienceOfInsurer(lazyLoadEvent).subscribe({
        next: (dto: IManyResponseDto<IClaimExperience>) => {
          this.claimExperiences = dto.data.entities
        }
      })
    }
    else {
      this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
        next: (dto: IManyResponseDto<IClaimExperience>) => {
          this.claimExperiences = dto.data.entities
        }
      })
    }
  }

}
