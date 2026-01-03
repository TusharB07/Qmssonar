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
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { ICGLTemplate, IQuoteSlip, SubjectivityAndMajorExclusions, SubsidiaryCGLDetails, liabiltyCGLAddOnCovers, liabiltyProductDeductibles, uploadAttachmentDetails, uploadedListOfLocations } from 'src/app/features/admin/quote/quote.model';
@Component({
  selector: 'app-sub-template-liability-cgl',
  templateUrl: './sub-template-liability-cgl.component.html',
  styleUrls: ['./sub-template-liability-cgl.component.scss']
})
export class SubTemplateLiabilityCGLComponent implements OnInit {
  @Input() quote: IQuoteSlip;
  private currentQuote: Subscription;
  quoteId: string = "";
  quoteCGLOptions: any;
  role: IRole
  AllowedRoles = AllowedRoles
  fileDetails: uploadAttachmentDetails[] = [];
  listOflocationsDetails: uploadedListOfLocations[] = [];
  subsidaryDetails: SubsidiaryCGLDetails[] = [];
  liabiltyCovers: liabiltyCGLAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  claimExperiences: IClaimExperience[] = []
  optionsInsuredBusinessActivity: ILov[] = []
  insuredBusinessActivity: string = ""
  showExclusionAndSubjectivity: boolean = false
  AllowedProductTemplate = AllowedProductTemplate;
  deductiblesInfo: liabiltyProductDeductibles[] = [];
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

  colsPL: ILov[] = [
    { value: 'period', label: 'Period/Locations' },
    { value: 'firstYear', label: '' },
    { value: 'secondyear', label: '' },
    { value: 'thirdYear', label: '' },
    { value: 'fourthYear', label: '' },
    { value: 'fifthYear', label: '' },
    { value: 'EstForNextYear', label: 'Est for next year' },
  ];
  rowsPL: ILov[] = [
    { value: 'india', label: 'India' },
  ];
  majorExclusions: SubjectivityAndMajorExclusions[] = []
  subjectivities: SubjectivityAndMajorExclusions[] = []
  constructor(private wclistofmasterservice: WCListOfValueMasterService, private accountService: AccountService, private quoteService: QuoteService, private claimExperienceService: ClaimExperienceService, private appService: AppService, private liabilityTemplateService: liabilityCGLTemplateService) {
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
        if ([AllowedProductTemplate.LIABILITY_CGL].includes(this.quote?.productId['productTemplate']) || [AllowedProductTemplate.LIABILITY_PUBLIC].includes(this.quote?.productId['productTemplate'])) {
          this.liabilityTemplateService.getTemplateById(template._id, template.quoteId).subscribe({
            next: quoteLiablitity => {
              if (quoteLiablitity) {
                this.quoteCGLOptions = quoteLiablitity.data.entity
                this.subsidaryDetails = this.quoteCGLOptions.subsidaryDetails
                this.fileDetails = this.quoteCGLOptions.basicDetailsAttchments;
                this.listOflocationsDetails = this.quoteCGLOptions.listOfLocations;
                this.subsidaryDetails.forEach(element => {
                  if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
                    element.activityName = 'N/A'
                  }
                });
                this.liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
                this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected)
                this.liabiltyCovers.forEach(element => {
                  if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
                    element.optionSelected = 'N/A'
                  }
                  if (element.description == '' || element.description == null || element.description == undefined) {
                    element.description = 'N/A'
                  }
                });
                this.deductiblesInfo = this.quoteCGLOptions.liabiltyDeductibles
                this.majorExclusions = this.quoteCGLOptions.majorExclusions
                this.subjectivities = this.quoteCGLOptions.subjectivity
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
    this.cols[5].label = currentYear.toString();
    this.cols[4].label = (currentYear - 1).toString();
    this.cols[3].label = (currentYear - 2).toString();
    this.cols[2].label = (currentYear - 3).toString();
    this.cols[1].label = (currentYear - 4).toString();

    this.colsPL[5].label = currentYear.toString();
    this.colsPL[4].label = (currentYear - 1).toString();
    this.colsPL[3].label = (currentYear - 2).toString();
    this.colsPL[2].label = (currentYear - 3).toString();
    this.colsPL[1].label = (currentYear - 4).toString();
  }
  getTotalfirstYear() {
    const firstYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.firstYear;
    }, 0);
    return firstYear;
  }

  getTotalsecondYear() {
    const secondYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.secondYear;
    }, 0);
    return secondYear;
  }

  getTotalthirdYear() {
    const thirdYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.thirdYear;
    }, 0);
    return thirdYear;
  }
  getTotalfourthYear() {
    const fourthYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.fourthYear;
    }, 0);
    return fourthYear;
  }

  getTotalfifthYear() {
    const fifthYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.fifthYear;
    }, 0);
    return fifthYear;
  }
  getTotalestimatedForNextYear() {
    const estimatedForNextYear = this.quoteCGLOptions.turnOverDetails.revenueRows.reduce((accumulator, object) => {
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
        this.insuredBusinessActivity = this.optionsInsuredBusinessActivity.find(s => s.value == this.quoteCGLOptions.insuredBusinessActivityId).label;
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
    let templateId =  this.quote?.liabilityCGLTemplateDataId["_id"] ||  this.quote?.liabilityCGLTemplateDataId     
    this.liabilityTemplateService.getTemplateById(templateId, this.quoteId).subscribe({
      next: quoteLiablitity => {
        this.quoteCGLOptions = quoteLiablitity.data.entity
        this.subsidaryDetails = this.quoteCGLOptions.subsidaryDetails
        this.fileDetails = this.quoteCGLOptions.basicDetailsAttchments;
        this.listOflocationsDetails = this.quoteCGLOptions.listOfLocations;
        this.subsidaryDetails.forEach(element => {
          if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
            element.activityName = 'N/A'
          }


        });
        this.liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
        this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected)
        this.liabiltyCovers.forEach(element => {
          if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
            element.optionSelected = 'N/A'
          }

          if (element.description == '' || element.description == null || element.description == undefined) {
            element.description = 'N/A'
          }
        });
        this.deductiblesInfo = this.quoteCGLOptions.liabiltyDeductibles
        this.majorExclusions = this.quoteCGLOptions.majorExclusions
        this.subjectivities = this.quoteCGLOptions.subjectivity
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
