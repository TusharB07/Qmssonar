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
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { EmployeesDetails, IDANDOTemplate, IQuoteSlip, SubjectivityAndMajorExclusions, SubsidiaryDetails, liabiltyAddOnCovers, uploadAttachmentDetails } from 'src/app/features/admin/quote/quote.model';

@Component({
  selector: 'app-sub-template-liability',
  templateUrl: './sub-template-liability.component.html',
  styleUrls: ['./sub-template-liability.component.scss']
})
export class SubTemplateLiabilityComponent implements OnInit {
  @Input() quote: IQuoteSlip;
  private currentQuote: Subscription;
  quoteId: string = "";
  quoteDandOOptions: any
  role: IRole
  templateName: any;
  AllowedRoles = AllowedRoles
  fileDetails: uploadAttachmentDetails[] = [];
  subsidaryDetails: SubsidiaryDetails[] = [];
  liabiltyCovers: liabiltyAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  claimExperiences: IClaimExperience[] = []
  optionsInsuredBusinessActivity: ILov[] = []
  insuredBusinessActivity: string = ""
  showEditOption: boolean = false
  AllowedProductTemplate = AllowedProductTemplate;
  employeesDetails: EmployeesDetails[] = []
  private currentSelectedTemplate: Subscription;
  cols: ILov[] = [
    { value: 'period', label: 'Period/Locations' },
    { value: 'firstYear', label: '' },
    { value: 'secondyear', label: '' },
    { value: 'thirdYear', label: '' },
    { value: 'fourthYear', label: '' },
    { value: 'fifthYear', label: '' },
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
  majorExclusions: SubjectivityAndMajorExclusions[] = []
  subjectivities: SubjectivityAndMajorExclusions[] = []
  constructor(private wclistofmasterservice: WCListOfValueMasterService, private accountService: AccountService, private quoteService: QuoteService, private claimExperienceService: ClaimExperienceService, private appService: AppService, private liabilityTemplateService: liabilityTemplateService) {
    this.accountService.currentUser$.subscribe({
      next: user => {
        const role: IRole = user.roleId as IRole;
        if (AllowedRoles.INSURER_UNDERWRITER != role?.name) {
          this.showEditOption = false;
        }
        else {
          this.showEditOption = true;
        }
      }
    });

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
      }
    })


    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
          this.liabilityTemplateService.getTemplateById(template._id, template.quoteId).subscribe({
            next: quoteLiablitity => {
              if (quoteLiablitity) {
                this.quoteDandOOptions = quoteLiablitity.data.entity
                this.fileDetails = this.quoteDandOOptions.basicDetailsAttchments;
                this.subsidaryDetails = this.quoteDandOOptions.subsidaryDetails
                this.subsidaryDetails.forEach(element => {
                  if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
                    element.activityName = 'N/A'
                  }
                });
                this.liabiltyCovers = this.quoteDandOOptions.liabiltyCovers
                this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected)
                this.liabiltyCovers.forEach(element => {
                  if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
                    element.optionSelected = 'N/A'
                  }

                  if (element.description == '' || element.description == null || element.description == undefined) {
                    element.description = 'N/A'
                  }
                });
                if (this.templateName == AllowedProductTemplate.LIABILITY_CRIME) {
                  this.employeesDetails = this.quoteDandOOptions.employeesDetails
                }
                this.majorExclusions = this.quoteDandOOptions.majorExclusions
                this.subjectivities = this.quoteDandOOptions.subjectivity
              }
              this.loadInsuredBusinessActivity()
            },
            error: error => {
              console.log(error);
            }
          });
        }
    })

    this.optionCovers = LIABILITY_COVERS_OPTIONS;
    this.updateYears()

  }

  updateYears() {
    const currentYear = new Date().getFullYear();
    this.cols[5].label = currentYear.toString();
    this.cols[4].label = (currentYear - 1).toString();
    this.cols[3].label = (currentYear - 2).toString();
    this.cols[2].label = (currentYear - 3).toString();
    this.cols[1].label = (currentYear - 4).toString();
  }
  getTotalfirstYear() {
    const firstYear = this.quoteDandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.firstYear;
    }, 0);
    return firstYear;
  }

  getTotalsecondYear() {
    const secondYear = this.quoteDandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.secondYear;
    }, 0);
    return secondYear;
  }

  getTotalthirdYear() {
    const thirdYear = this.quoteDandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.thirdYear;
    }, 0);
    return thirdYear;
  }

  getTotalfourthYear() {
    const fourthYear = this.quoteDandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.fourthYear;
    }, 0);
    return fourthYear;
  }

  getTotalfifthYear() {
    const fifthYear = this.quoteDandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.fifthYear;
    }, 0);
    return fifthYear;
  }
  getTotalestimatedForNextYear() {
    const estimatedForNextYear = this.quoteDandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.estimatedForNextYear;
      ;
    }, 0);
    return estimatedForNextYear;
  }
  loadInsuredBusinessActivity() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_INSURED_BUSINESS_ACTIVITY).subscribe({
      next: records => {
        if (records.data.entities.length > 0) {
          records.data.entities = records.data.entities.sort((a, b) => (a.lovKey < b.lovKey ? -1 : 1));
        }
        this.optionsInsuredBusinessActivity = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        this.insuredBusinessActivity = this.optionsInsuredBusinessActivity.find(s => s.value == this.quoteDandOOptions.insuredBusinessActivityId).label;
      },
      error: e => {
        console.log(e);
      }
    });
  }

  isOtherDetailsPresent() {

  }

  getSelectedDeductibles() {
    var addedDeductibles = this.quoteDandOOptions.liabiltyDeductibles;
    if (addedDeductibles.length > 0) {
      addedDeductibles = addedDeductibles.filter(x => x.amount > 0);
    }
    return addedDeductibles;
  }

  ngOnInit(): void {
    // this.currentQuote = this.quoteService.currentQuote$.subscribe({
    //   next: (quote) => {
    //     this.quote = quote
    this.quoteId = this.quote._id;
    if (!this.showEditOption && !this.quote.insurerProcessedQuotes) {
      if (this.quote.quoteState == 'QCR From Underwritter' || this.quote.quoteState == 'Under Writter Review') {
        this.showEditOption = true;
      }
    }
    let templateId =  this.quote?.liabilityTemplateDataId["_id"] ||  this.quote?.liabilityTemplateDataId     
    this.liabilityTemplateService.getTemplateById(templateId, this.quoteId).subscribe({
      next: quoteLiablitity => {
        console.log("DANDO Get Successfully");
        this.quoteDandOOptions = quoteLiablitity.data.entity
        this.fileDetails = this.quoteDandOOptions.basicDetailsAttchments;
        this.subsidaryDetails = this.quoteDandOOptions.subsidaryDetails
        this.subsidaryDetails.forEach(element => {
          if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
            element.activityName = 'N/A'
          }
        });
        this.liabiltyCovers = this.quoteDandOOptions.liabiltyCovers
        this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected)
        this.liabiltyCovers.forEach(element => {
          if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
            element.optionSelected = 'N/A'
          }

          if (element.description == '' || element.description == null || element.description == undefined) {
            element.description = 'N/A'
          }
        });
        if (this.templateName == AllowedProductTemplate.LIABILITY_CRIME) {
          this.employeesDetails = this.quoteDandOOptions.employeesDetails
        }
        this.majorExclusions = this.quoteDandOOptions.majorExclusions
        this.subjectivities = this.quoteDandOOptions.subjectivity
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
    //   }
    // })
  }

}
